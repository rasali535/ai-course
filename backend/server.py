from fastapi import FastAPI, APIRouter, Request, Response
from starlette.middleware.cors import CORSMiddleware
import logging
import os
from fastapi.staticfiles import StaticFiles
from backend.sql_database import engine, Base
import backend.sql_models  # Ensure models are registered
import backend.course_model # Ensure course models are registered
import backend.enrollment_model # Ensure enrollment models are registered
from backend.routers import auth, resources, payments, courses, enrollments, media, ai
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# App init
app = FastAPI()

# CORS Architecture
# We pull from env but provide a comprehensive default for local development.
raw_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:8080,http://localhost:8081,http://localhost:8082,https://pohei.de,https://www.pohei.de')
origins = [origin.strip() for origin in raw_origins.split(',') if origin.strip()]

# If no origins are found, we allow all in development to prevent blockers
if not origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True if "*" not in origins else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Robust CSP Middleware to allow Stripe, PostHog and Inline Styles
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Comprehensive CSP policy that handles Stripe and PostHog's complex loading
    csp_policy = (
        "default-src 'self'; "
        "script-src 'self' https://js.stripe.com https://m.stripe.network https://us.i.posthog.com https://app.posthog.com 'unsafe-inline' 'unsafe-eval' blob:; "
        "style-src 'self' https://fonts.googleapis.com https://js.stripe.com 'unsafe-inline'; "
        "img-src 'self' data: blob: https://*.unsplash.com https://*.stripe.com https://us.i.posthog.com; "
        "connect-src 'self' https://*.supabase.co https://*.stripe.com https://us.i.posthog.com https://app.posthog.com ws: wss:; "
        "frame-src 'self' https://js.stripe.com https://hooks.stripe.com; "
        "font-src 'self' https://fonts.gstatic.com data:;"
    )
    
    # Only set for HTML or entire API if needed for browser-level tests
    response.headers["Content-Security-Policy"] = csp_policy
    return response

# Main API Router
api_router = APIRouter(prefix="/api")

@app.get("/")
async def root():
    """
    Health check endpoint for Render.
    """
    return {"message": "LearnFlow API is Pulse-Ready", "status": "active"}

# Include sub-routers under /api
# We standardize everything under /api/{router_prefix}
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(resources.router, prefix="/resources", tags=["resources"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(ai.router) # Already has /ai prefix
api_router.include_router(courses.router) # Already has /courses prefix
api_router.include_router(enrollments.router) # Already has /enrollments prefix
api_router.include_router(media.router, prefix="/media", tags=["media"])

app.include_router(api_router)

# Mount static files if directory exists and is NOT empty
static_path = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_path) and any(os.scandir(static_path)):
    app.mount("/static", StaticFiles(directory=static_path), name="static")
elif os.path.exists("static") and any(os.scandir("static")):
    app.mount("/static", StaticFiles(directory="static"), name="static")


# Events
@app.on_event("startup")
async def startup_event():
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logging.info("Database tables created/verified successfully.")
    except Exception as e:
        logging.error(f"Failed to initialize database: {e}")
        logging.warning("Application starting WITHOUT database connection. Some features may be limited.")

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)