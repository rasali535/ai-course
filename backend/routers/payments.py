from fastapi import APIRouter, HTTPException, Depends, Request, Response
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
import stripe
import os
import requests
import base64
from backend.deps import get_current_user
from backend.models import User
from backend.sql_models import SQLUser
from backend.sql_database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.limiter import limiter

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_your_key_here")

# Initialize PayPal
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox")  # sandbox or live
PAYPAL_API_BASE = f"https://api-m.{PAYPAL_MODE}.paypal.com" if PAYPAL_MODE == "sandbox" else "https://api-m.paypal.com"

import xml.etree.ElementTree as ET
from datetime import datetime

router = APIRouter()

# DPO Configuration
DPO_COMPANY_TOKEN = os.getenv("DPO_COMPANY_TOKEN", "your_dpo_company_token_here")
DPO_SERVICE_TYPE = os.getenv("DPO_SERVICE_TYPE", "3854")  # Standard service type
DPO_API_URL = "https://secure.3gdirectpay.com/API/v6/"
DPO_PAYMENT_URL = "https://secure.3gdirectpay.com/payv2.php?ID="

# Pydantic Models
class CheckoutSessionRequest(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str
    customer_email: Optional[EmailStr] = None
    payment_method: Optional[str] = "stripe"  # stripe or paypal

class SubscriptionRequest(BaseModel):
    price_id: str
    customer_email: EmailStr

class PayPalOrderRequest(BaseModel):
    amount: float
    currency: str = "USD"
    description: Optional[str] = None
    return_url: str
    cancel_url: str

class PaymentIntentRequest(BaseModel):
    amount: int  # Amount in cents
    currency: str = "usd"
    description: Optional[str] = None

class DPOPaymentRequest(BaseModel):
    amount: float
    currency: str = "USD"
    service_description: str
    customer_email: EmailStr
    customer_first_name: str
    customer_last_name: str
    company_ref: Optional[str] = None
    redirect_url: str
    back_url: str
    result_url: Optional[str] = None # Added for webhook support

# Helper Functions
def get_paypal_access_token():
    """Get PayPal OAuth access token"""
    auth = base64.b64encode(f"{PAYPAL_CLIENT_ID}:{PAYPAL_CLIENT_SECRET}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    response = requests.post(f"{PAYPAL_API_BASE}/v1/oauth2/token", headers=headers, data=data)
    if response.status_code == 200:
        return response.json().get("access_token")
    raise HTTPException(status_code=500, detail="Failed to get PayPal access token")

# ============= STRIPE ENDPOINTS =============

@router.post("/create-premium-checkout")
@limiter.limit("5/minute")
async def create_premium_checkout(
    request: Request,
    plan: str, 
    success_url: str, 
    cancel_url: str, 
    current_user: User = Depends(get_current_user)
):
    """
    Create a Stripe Checkout Session for a specific plan linked to a user
    """
    try:
        # Map human plan names to Price IDs
        price_map = {
            "standard": os.getenv("STRIPE_PRICE_STANDARD", "price_standard_placeholder"),
            "premium": os.getenv("STRIPE_PRICE_PREMIUM", "price_premium_placeholder")
        }
        price_id = price_map.get(plan)
        
        if not price_id or price_id == "price_standard_placeholder":
            # Fallback if no real IDs are set yet, but log it
            print(f"WARNING: Using placeholder for {plan} plan. Payments will not work.")

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=success_url,
            cancel_url=cancel_url,
            customer_email=current_user.email,
            client_reference_id=current_user.id,
            metadata={
                "plan": plan,
                "user_id": current_user.id
            }
        )
        return {"sessionId": session.id, "url": session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/create-subscription-checkout")
async def create_subscription_checkout(request: CheckoutSessionRequest):
    """
    Create a Stripe Checkout Session specifically for subscriptions
    """
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': request.price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            customer_email=request.customer_email,
        )
        return {"sessionId": session.id, "url": session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/create-payment-intent")
async def create_payment_intent(request: PaymentIntentRequest):
    """
    Create a Payment Intent for custom payment flows
    """
    try:
        intent = stripe.PaymentIntent.create(
            amount=request.amount,
            currency=request.currency,
            description=request.description,
            automatic_payment_methods={
                'enabled': True,
            },
        )
        return {
            "clientSecret": intent.client_secret,
            "paymentIntentId": intent.id
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/subscription-status/{subscription_id}")
async def get_subscription_status(subscription_id: str, current_user: User = Depends(get_current_user)):
    """
    Get the status of a subscription
    """
    try:
        subscription = stripe.Subscription.retrieve(subscription_id)
        return {
            "id": subscription.id,
            "status": subscription.status,
            "current_period_end": subscription.current_period_end,
            "cancel_at_period_end": subscription.cancel_at_period_end,
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/cancel-subscription/{subscription_id}")
async def cancel_subscription(subscription_id: str, current_user: User = Depends(get_current_user)):
    """
    Cancel a subscription at the end of the billing period
    """
    try:
        subscription = stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=True
        )
        return {
            "id": subscription.id,
            "status": subscription.status,
            "cancel_at_period_end": subscription.cancel_at_period_end,
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Handle Stripe webhook events with signature verification
    """
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    if not endpoint_secret:
        # In development/sandbox, we might skip verification if secret is missing
        # But for product readiness, we log a warning
        print("WARNING: STRIPE_WEBHOOK_SECRET not set. Skipping verification (DEV ONLY).")
        try:
            event = stripe.Event.construct_from(await request.json(), stripe.api_key)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid payload: {e}")
    else:
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        except ValueError as e:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            raise HTTPException(status_code=400, detail="Invalid signature")

    event_type = event['type']
    data_object = event['data']['object']

    if event_type == 'checkout.session.completed':
        session = data_object
        customer_email = session.get('customer_email')
        client_reference_id = session.get('client_reference_id') # This should be the Supabase UserId
        
        # Determine plan from metadata
        metadata = session.get('metadata', {})
        plan_id = metadata.get('plan', 'standard')
        
        # Find user and update
        user_id = client_reference_id
        if user_id:
            result = await db.execute(select(SQLUser).where(SQLUser.id == user_id))
            user = result.scalar_one_or_none()
            if user:
                user.plan = plan_id
                user.subscription_status = 'active'
                user.stripe_customer_id = session.get('customer')
                user.stripe_subscription_id = session.get('subscription')
                await db.commit()
                print(f"SUCCESS: Updated user {user_id} to {plan_id} plan via Stripe.")

    elif event_type == 'customer.subscription.deleted':
        subscription = data_object
        stripe_sub_id = subscription.get('id')
        
        result = await db.execute(select(SQLUser).where(SQLUser.stripe_subscription_id == stripe_sub_id))
        user = result.scalar_one_or_none()
        if user:
            user.subscription_status = 'expired'
            await db.commit()
            print(f"INFO: Subscription {stripe_sub_id} deleted. User access revoked.")

    return {"status": "success"}

@router.get("/prices")
async def get_prices():
    """
    Get all available pricing plans
    """
    try:
        prices = stripe.Price.list(active=True, expand=['data.product'])
        return {"prices": prices.data}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============= PAYPAL ENDPOINTS =============

@router.post("/paypal/create-order")
@limiter.limit("5/minute")
async def create_paypal_order(request: Request, paypal_req: PayPalOrderRequest, current_user: User = Depends(get_current_user)):
    """
    Create a PayPal order for payment
    """
    try:
        access_token = get_paypal_access_token()
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        
        order_data = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": paypal_req.currency,
                    "value": str(paypal_req.amount)
                },
                "description": paypal_req.description or "LearnFlow Subscription",
                "custom_id": f"user_{current_user.id}" # Link to user
            }],
            "application_context": {
                "return_url": paypal_req.return_url,
                "cancel_url": paypal_req.cancel_url,
                "brand_name": "LearnFlow",
                "landing_page": "BILLING",
                "user_action": "PAY_NOW"
            }
        }
        
        response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders",
            headers=headers,
            json=order_data
        )
        
        if response.status_code == 201:
            order = response.json()
            # Find the approval URL
            approval_url = next(
                (link["href"] for link in order.get("links", []) if link["rel"] == "approve"),
                None
            )
            return {
                "orderId": order["id"],
                "approvalUrl": approval_url,
                "status": order["status"]
            }
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/paypal/capture-order/{order_id}")
async def capture_paypal_order(order_id: str, db: AsyncSession = Depends(get_db)):
    """
    Capture a PayPal order after customer approval
    """
    try:
        access_token = get_paypal_access_token()
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        
        response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture",
            headers=headers
        )
        
        if response.status_code == 201:
            capture_data = response.json()
            
            # Fulfillment Logic
            if capture_data.get("status") == "COMPLETED":
                purchase_unit = capture_data.get("purchase_units", [{}])[0]
                custom_id = purchase_unit.get("payments", {}).get("captures", [{}])[0].get("custom_id")
                
                # If custom_id is missing, check the original order
                if not custom_id:
                    order_resp = requests.get(f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}", headers=headers)
                    if order_resp.status_code == 200:
                        custom_id = order_resp.json().get("purchase_units", [{}])[0].get("custom_id")
                
                if custom_id and custom_id.startswith("user_"):
                    user_id = custom_id.replace("user_", "")
                    result = await db.execute(select(SQLUser).where(SQLUser.id == user_id))
                    user = result.scalar_one_or_none()
                    if user:
                        user.plan = "premium" # Default for now, should parse from description
                        user.subscription_status = 'active'
                        await db.commit()
                        print(f"SUCCESS: PayPal Fulfillment complete for user {user_id}")
            
            return {
                "orderId": order_id,
                "status": capture_data["status"],
                "captureId": capture_data.get("purchase_units", [{}])[0].get("payments", {}).get("captures", [{}])[0].get("id"),
                "amount": capture_data.get("purchase_units", [{}])[0].get("payments", {}).get("captures", [{}])[0].get("amount")
            }
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/paypal/order-status/{order_id}")
async def get_paypal_order_status(order_id: str):
    """
    Get the status of a PayPal order
    """
    try:
        access_token = get_paypal_access_token()
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        
        response = requests.get(
            f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}",
            headers=headers
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============= DPO (Direct Pay Online) ENDPOINTS =============

@router.post("/dpo/create-token")
@limiter.limit("5/minute")
async def create_dpo_token(request: Request, dpo_req: DPOPaymentRequest, current_user: User = Depends(get_current_user)):
    """
    Create a DPO Payment Token
    """
    try:
        # Construct XML Payload for DPO API v6
        company_token = DPO_COMPANY_TOKEN
        service_type = DPO_SERVICE_TYPE
        
        # Ensure currency for Botswana is supported
        # Botswana Pula (BWP)
        currency = dpo_req.currency.upper()
        
        # Current Date Time for ServiceDate
        now = datetime.now().strftime("%Y/%m/%d %H:%M")
        
        xml_payload = f"""<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>{company_token}</CompanyToken>
  <Request>createToken</Request>
  <Transaction>
    <PaymentAmount>{dpo_req.amount:.2f}</PaymentAmount>
    <PaymentCurrency>{currency}</PaymentCurrency>
    <CompanyRef>{f"user_{current_user.id}"}</CompanyRef>
    <RedirectURL>{dpo_req.redirect_url}</RedirectURL>
    <BackURL>{dpo_req.back_url}</BackURL>
    <CompanyRefContinuous>0</CompanyRefContinuous>
    <TransactionApproval>0</TransactionApproval>
  </Transaction>
  <Services>
    <Service>
      <ServiceType>{service_type}</ServiceType>
      <ServiceDescription>{dpo_req.service_description}</ServiceDescription>
      <ServiceDate>{now}</ServiceDate>
    </Service>
  </Services>
</API3G>"""

        # Update XML if result_url is provided
        if dpo_req.result_url:
            # Insert ResultURL after BackURL
            xml_payload = xml_payload.replace(f"<BackURL>{dpo_req.back_url}</BackURL>", 
                                             f"<BackURL>{dpo_req.back_url}</BackURL>\n    <ResultURL>{dpo_req.result_url}</ResultURL>")

        headers = {"Content-Type": "application/xml"}
        
        # In actual implementation: response = requests.post(DPO_API_URL, data=xml_payload, headers=headers)
        # For this environment, if no keys exist, we provide a structured mock but log the payload
        
        if company_token == "your_dpo_company_token_here":
            # LOGGING: payload created successfully
            print(f"DEBUG: DPO XML Payload: {xml_payload}")
            
            # SIMULATING RESPONSE
            import uuid
            mock_trans_token = f"DPO-{uuid.uuid4()}"
            mock_trans_ref = f"REF-{uuid.uuid4()}"
            
            return {
                "result": "000",
                "resultExplanation": "Transaction Created (Sandbox Mode)",
                "transToken": mock_trans_token,
                "transRef": mock_trans_ref,
                "paymentUrl": f"{DPO_PAYMENT_URL}{mock_trans_token}",
                "currency": currency,
                "amount": dpo_req.amount
            }

        response = requests.post(DPO_API_URL, data=xml_payload, headers=headers)
        
        if response.status_code == 200:
            root = ET.fromstring(response.text)
            result = root.find("Result").text if root.find("Result") is not None else "Error"
            result_explanation = root.find("ResultExplanation").text if root.find("ResultExplanation") is not None else "N/A"
            trans_token = root.find("TransToken").text if root.find("TransToken") is not None else ""
            trans_ref = root.find("TransRef").text if root.find("TransRef") is not None else ""
            
            if result == "000":
                return {
                    "result": result,
                    "resultExplanation": result_explanation,
                    "transToken": trans_token,
                    "transRef": trans_ref,
                    "paymentUrl": f"{DPO_PAYMENT_URL}{trans_token}"
                }
            else:
                raise HTTPException(status_code=400, detail=f"DPO Error: {result_explanation} ({result})")
        else:
            raise HTTPException(status_code=500, detail=f"DPO API Connection Error: {response.status_code}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DPO Token Creation Failed: {str(e)}")

@router.get("/dpo/verify-token/{trans_token}")
async def verify_dpo_token(trans_token: str, db: AsyncSession = Depends(get_db)):
    """
    Verify status of a DPO Transaction
    """
    try:
        company_token = DPO_COMPANY_TOKEN
        
        xml_payload = f"""<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>{company_token}</CompanyToken>
  <Request>verifyToken</Request>
  <TransactionToken>{trans_token}</TransactionToken>
</API3G>"""

        headers = {"Content-Type": "application/xml"}
        
        if company_token == "your_dpo_company_token_here":
            return {
                "result": "000",
                "resultExplanation": "Transaction Paid (Mock Success)",
                "customerName": "Test User",
                "amount": "0.00",
                "currency": "BWP"
            }

        response = requests.post(DPO_API_URL, data=xml_payload, headers=headers)
        
        if response.status_code == 200:
            root = ET.fromstring(response.text)
            result = root.find("Result").text if root.find("Result") is not None else "Error"
            result_explanation = root.find("ResultExplanation").text if root.find("ResultExplanation") is not None else ""
            company_ref = root.find("CompanyRef").text if root.find("CompanyRef") is not None else ""
            
            # Fulfillment Logic
            if result == "000":
                if company_ref and company_ref.startswith("user_"):
                    user_id = company_ref.replace("user_", "")
                    result_db = await db.execute(select(SQLUser).where(SQLUser.id == user_id))
                    user = result_db.scalar_one_or_none()
                    if user:
                        user.plan = "premium" # Or parse from metadata if added
                        user.subscription_status = 'active'
                        await db.commit()
                        print(f"SUCCESS: DPO Fulfillment complete for user {user_id}")

            return {
                "result": result,
                "resultExplanation": result_explanation,
                "customerName": root.find("CustomerName").text if root.find("CustomerName") is not None else "N/A",
                "amount": root.find("TransactionAmount").text if root.find("TransactionAmount") is not None else "0.00",
                "currency": root.find("TransactionCurrency").text if root.find("TransactionCurrency") is not None else "N/A"
            }
        else:
            raise HTTPException(status_code=500, detail="DPO Verification Failed")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/payout-info")
async def get_payout_information():
    """
    Get information about how suppliers/course creators receive their funds
    
    This endpoint explains the payment flow and payout schedule for course creators
    """
    return {
        "payout_methods": {
            "stripe": {
                "name": "Stripe Connect",
                "description": "Automated payouts to your bank account",
                "schedule": "Rolling basis (daily, weekly, or monthly)",
                "processing_time": "2-7 business days",
                "fees": "2.9% + $0.30 per transaction",
                "supported_countries": "45+ countries",
                "setup": {
                    "step_1": "Connect your Stripe account in Dashboard → Settings → Payouts",
                    "step_2": "Verify your bank account details",
                    "step_3": "Set your payout schedule (daily, weekly, monthly)",
                    "step_4": "Receive automatic transfers to your bank"
                },
                "minimum_payout": "$1.00 USD",
                "currency_support": "135+ currencies"
            },
            "paypal": {
                "name": "PayPal Payouts",
                "description": "Direct transfers to your PayPal account",
                "schedule": "Instant or scheduled",
                "processing_time": "Instant to 1 business day",
                "fees": "2.9% + $0.30 per transaction",
                "supported_countries": "200+ countries",
                "setup": {
                    "step_1": "Link your PayPal account in Dashboard → Settings → Payouts",
                    "step_2": "Verify your PayPal email",
                    "step_3": "Choose instant or scheduled payouts",
                    "step_4": "Receive funds directly to PayPal balance"
                },
                "minimum_payout": "$1.00 USD",
                "currency_support": "25+ currencies"
            },
            "bank_transfer": {
                "name": "Direct Bank Transfer",
                "description": "ACH/Wire transfer to your bank account",
                "schedule": "Weekly or monthly",
                "processing_time": "3-5 business days (ACH), 1-2 days (Wire)",
                "fees": "No additional fees (included in platform fee)",
                "supported_countries": "US, UK, EU, Canada, Australia",
                "setup": {
                    "step_1": "Add bank account in Dashboard → Settings → Bank Accounts",
                    "step_2": "Verify with micro-deposits",
                    "step_3": "Set payout schedule",
                    "step_4": "Receive automatic transfers"
                },
                "minimum_payout": "$25.00 USD"
            }
        },
        "payment_flow": {
            "step_1": {
                "title": "Student Makes Purchase",
                "description": "Student pays for your course via Stripe or PayPal",
                "timing": "Instant"
            },
            "step_2": {
                "title": "Payment Processing",
                "description": "Payment is processed and verified",
                "timing": "1-2 seconds"
            },
            "step_3": {
                "title": "Platform Fee Deduction",
                "description": "LearnFlow platform fee is deducted (if applicable)",
                "timing": "Instant"
            },
            "step_4": {
                "title": "Funds Held (Optional)",
                "description": "Funds may be held for refund period (7-30 days)",
                "timing": "Configurable"
            },
            "step_5": {
                "title": "Payout Initiated",
                "description": "Funds are transferred to your chosen payout method",
                "timing": "Based on your schedule"
            },
            "step_6": {
                "title": "Funds Received",
                "description": "Money arrives in your bank account or PayPal",
                "timing": "2-7 business days"
            }
        },
        "revenue_tracking": {
            "dashboard": "Real-time revenue tracking in your dashboard",
            "reports": "Detailed transaction reports available",
            "analytics": "Revenue analytics and forecasting",
            "tax_documents": "Automatic 1099-K generation (US) and tax reports"
        },
        "refund_policy": {
            "description": "Refunds are deducted from your next payout",
            "processing": "Automatic refund processing",
            "notification": "Email notification for all refunds"
        },
        "support": {
            "email": "payouts@learnflow.com",
            "documentation": "https://docs.learnflow.com/payouts",
            "live_chat": "Available in dashboard"
        }
    }

@router.post("/paypal/webhook")
async def paypal_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Handle PayPal webhook events
    """
    payload = await request.json()
    event_type = payload.get("event_type")
    
    print(f"INFO: Received PayPal Webhook: {event_type}")
    
    # In production, verify the webhook signature here
    # https://developer.paypal.com/docs/api/notifications/v1/#webhooks-verify-signature_post
    
    if event_type in ["CHECKOUT.ORDER.APPROVED", "PAYMENT.CAPTURE.COMPLETED"]:
        resource = payload.get("resource", {})
        
        # Extract user_id from custom_id (if available)
        custom_id = None
        if event_type == "CHECKOUT.ORDER.APPROVED":
            purchase_units = resource.get("purchase_units", [])
            if purchase_units:
                custom_id = purchase_units[0].get("custom_id")
        else: # PAYMENT.CAPTURE.COMPLETED
            custom_id = resource.get("custom_id")
            
        if custom_id and custom_id.startswith("user_"):
            user_id = custom_id.replace("user_", "")
            result = await db.execute(select(SQLUser).where(SQLUser.id == user_id))
            user = result.scalar_one_or_none()
            if user:
                user.plan = "premium"
                user.subscription_status = 'active'
                await db.commit()
                print(f"SUCCESS: PayPal Fulfillment via Webhook for user {user_id}")
                
    return {"status": "success"}

@router.post("/dpo/webhook")
async def dpo_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Handle DPO Push Notification (Webhook)
    DPO sends an XML payload to the ResultURL
    """
    body = await request.body()
    try:
        root = ET.fromstring(body)
        result = root.find("Result").text if root.find("Result") is not None else ""
        company_ref = root.find("CompanyRef").text if root.find("CompanyRef") is not None else ""
        trans_token = root.find("TransactionToken").text if root.find("TransactionToken") is not None else ""
        
        print(f"INFO: DPO Webhook received for {company_ref}. Result: {result}")
        
        if result == "000" and company_ref.startswith("user_"):
            user_id = company_ref.replace("user_", "")
            result_db = await db.execute(select(SQLUser).where(SQLUser.id == user_id))
            user = result_db.scalar_one_or_none()
            if user:
                user.plan = "premium" # Or parse from metadata
                user.subscription_status = 'active'
                await db.commit()
                print(f"SUCCESS: DPO Fulfillment via Webhook for user {user_id}")
                
        # DPO expects a specific response to acknowledge the webhook
        return Response(content='<?xml version="1.0" encoding="utf-8"?><API3G><Response>OK</Response></API3G>', media_type="application/xml")
    except Exception as e:
        print(f"ERROR: DPO Webhook processing failed: {e}")
        return Response(content='<?xml version="1.0" encoding="utf-8"?><API3G><Response>Error</Response></API3G>', media_type="application/xml")

@router.get("/my-earnings")
async def get_my_earnings(current_user: User = Depends(get_current_user)):
    """
    Get current user's earnings and payout information
    
    This would typically fetch from database based on user's sales
    """
    # This is a placeholder - in production, fetch from database
    return {
        "user_id": current_user.id if hasattr(current_user, 'id') else "user_123",
        "total_revenue": 0.00,
        "pending_payout": 0.00,
        "next_payout_date": "2026-02-01",
        "payout_method": "stripe",
        "lifetime_earnings": 0.00,
        "currency": "USD",
        "transactions": [],
        "payout_history": []
    }
