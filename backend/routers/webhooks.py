from fastapi import APIRouter, Request, Depends, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from backend.sql_database import get_db
from backend.services.enrollment import handle_paypal_enrollment
import os
import json
import logging
import requests
import re

router = APIRouter(prefix="/webhooks", tags=["webhooks"])
logger = logging.getLogger(__name__)

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox")
PAYPAL_WEBHOOK_ID = os.getenv("PAYPAL_WEBHOOK_ID", "") # Preconfigured webhook ID
PAYPAL_API_BASE = f"https://api-m.{PAYPAL_MODE}.paypal.com" if PAYPAL_MODE == "sandbox" else "https://api-m.paypal.com"

def get_paypal_access_token():
    """Helper to get PayPal OAuth access token"""
    import base64
    auth = base64.b64encode(f"{PAYPAL_CLIENT_ID}:{PAYPAL_CLIENT_SECRET}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    response = requests.post(f"{PAYPAL_API_BASE}/v1/oauth2/token", headers=headers, data=data)
    if response.status_code == 200:
        return response.json().get("access_token")
    raise Exception(f"Failed to get PayPal access token. Status: {response.status_code}")

def verify_paypal_webhook_signature(headers: dict, raw_body: str, webhook_id: str) -> bool:
    """
    Verify PayPal webhook signature using PayPal's Verify Webhook Signature API
    """
    if not webhook_id:
        logger.warning("PAYPAL_WEBHOOK_ID not set. Skipping signature verification (DEV/SANDBOX mode).")
        return True

    try:
        access_token = get_paypal_access_token()
    except Exception as e:
        logger.error(f"Failed to fetch PayPal token for signature verification: {e}")
        return False

    try:
        event = json.loads(raw_body)
    except Exception as e:
        logger.error(f"Invalid webhook JSON body: {e}")
        return False

    # Extract required headers for PayPal verification API
    transmission_id = headers.get("paypal-transmission-id") or headers.get("PAYPAL-TRANSMISSION-ID")
    transmission_time = headers.get("paypal-transmission-time") or headers.get("PAYPAL-TRANSMISSION-TIME")
    cert_url = headers.get("paypal-cert-url") or headers.get("PAYPAL-CERT-URL")
    auth_algo = headers.get("paypal-auth-algo") or headers.get("PAYPAL-AUTH-ALGO")
    transmission_sig = headers.get("paypal-transmission-sig") or headers.get("PAYPAL-TRANSMISSION-SIG")

    if not all([transmission_id, transmission_time, cert_url, auth_algo, transmission_sig]):
        logger.error("Missing required PayPal verification headers.")
        return False

    payload = {
        "transmission_id": transmission_id,
        "transmission_time": transmission_time,
        "cert_url": cert_url,
        "auth_algo": auth_algo,
        "transmission_sig": transmission_sig,
        "webhook_id": webhook_id,
        "webhook_event": event
    }

    verify_headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    try:
        response = requests.post(
            f"{PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature",
            headers=verify_headers,
            json=payload
        )
        if response.status_code == 200:
            result = response.json()
            return result.get("verification_status") == "SUCCESS"
        else:
            logger.error(f"PayPal verify endpoint returned {response.status_code}: {response.text}")
            return False
    except Exception as e:
        logger.error(f"Error during PayPal signature verification API request: {e}")
        return False

@router.post("/paypal")
async def paypal_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Production-ready PayPal webhook endpoint.
    Verifies the webhook signature and handles purchase events to unlock courses.
    Always returns 200 OK immediately after verification to prevent retries.
    """
    # 1. Read raw body and headers
    raw_body = await request.body()
    headers_dict = dict(request.headers)
    
    # 2. Verify signature
    is_valid = verify_paypal_webhook_signature(headers_dict, raw_body.decode(), PAYPAL_WEBHOOK_ID)
    if not is_valid:
        logger.error("PayPal webhook signature verification failed.")
        return Response(content=json.dumps({"detail": "Invalid signature"}), media_type="application/json", status_code=status.HTTP_400_BAD_REQUEST)

    # 3. Parse JSON payload
    try:
        payload = json.loads(raw_body.decode())
    except Exception as e:
        logger.error(f"Failed to parse PayPal webhook payload: {e}")
        return Response(content=json.dumps({"detail": "Invalid JSON"}), media_type="application/json", status_code=status.HTTP_400_BAD_REQUEST)

    # 4. Handle events
    event_type = payload.get("event_type")
    logger.info(f"Processing PayPal webhook event: {event_type}")

    # Process successful payment events
    if event_type in ["PAYMENT.SALE.COMPLETED", "CHECKOUT.ORDER.APPROVED", "PAYMENT.CAPTURE.COMPLETED"]:
        try:
            resource = payload.get("resource", {})
            custom_id = None

            # Extract custom_id based on event structure
            if event_type == "CHECKOUT.ORDER.APPROVED":
                purchase_units = resource.get("purchase_units", [])
                if purchase_units:
                    custom_id = purchase_units[0].get("custom_id")
            else: # PAYMENT.SALE.COMPLETED or PAYMENT.CAPTURE.COMPLETED
                custom_id = resource.get("custom_id")

            if custom_id:
                logger.info(f"Found custom_id: {custom_id}")
                student_id = None
                course_id = None

                # Format 1: user_<user_id>_plan_certificate_<course_id>
                if "user_" in custom_id and "certificate_" in custom_id:
                    parts = custom_id.split("_plan_certificate_")
                    if len(parts) == 2:
                        student_id = parts[0].replace("user_", "")
                        try:
                            course_id = int(parts[1])
                        except ValueError:
                            pass
                # Format 2: student_<student_id>_course_<course_id>
                elif "student_" in custom_id and "course_" in custom_id:
                    match = re.search(r"student_([a-zA-Z0-9_\-]+)_course_(\d+)", custom_id)
                    if match:
                        student_id = match.group(1)
                        course_id = int(match.group(2))
                # Format 3: student_id:course_id
                elif ":" in custom_id:
                    parts = custom_id.split(":")
                    if len(parts) == 2:
                        student_id = parts[0]
                        try:
                            course_id = int(parts[1])
                        except ValueError:
                            pass

                if student_id and course_id:
                    logger.info(f"Fulfilling enrollment for student {student_id} and course {course_id}")
                    # Invoke modular database service to unlock course
                    await handle_paypal_enrollment(db, student_id, course_id)
                else:
                    logger.warning(f"Could not parse student_id and course_id from custom_id: {custom_id}")
            else:
                logger.warning("No custom_id found in payment resource payload.")

        except Exception as e:
            logger.error(f"Error processing payment fulfillment logic: {e}", exc_info=True)
            # We still return 200 to PayPal so it doesn't retry indefinitely
            return {"status": "error_handled"}

    return {"status": "success"}
