import os
from dotenv import load_dotenv

def validate_env():
    load_dotenv()
    
    required_keys = [
        "DATABASE_URL",
        "SECRET_KEY",
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "PAYPAL_CLIENT_ID",
        "PAYPAL_CLIENT_SECRET",
        "PAYPAL_WEBHOOK_ID",
        "DPO_COMPANY_TOKEN",
        "SENDGRID_API_KEY",
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
        "AWS_S3_BUCKET"
    ]
    
    missing = []
    for key in required_keys:
        val = os.getenv(key)
        if not val or "your_" in val.lower() or "_here" in val.lower():
            missing.append(key)
    
    if missing:
        print("❌ PRODUCTION READINESS: MISSING OR PLACEHOLDER KEYS FOUND:")
        for m in missing:
            print(f"  - {m}")
        return False
    
    print("✅ PRODUCTION READINESS: ALL REQUIRED PRODUCTION KEYS PRESENT.")
    return True

if __name__ == "__main__":
    validate_env()
