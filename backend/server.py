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

# App init
app = FastAPI()

# CORS Architecture
raw_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:8080,http://localhost:8081,http://localhost:8082,https://pohei.de,https://www.pohei.de,https://u723774100.pohei.de')
origins = [origin.strip() for origin in raw_origins.split(',') if origin.strip()]

# Credentials (cookies) are only allowed if we have explicit origins.
allow_all = "*" in origins
credentials_allowed = not allow_all

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=credentials_allowed,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom CSP Middleware to allow Stripe, PostHog and Inline Styles
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Define CSP policy that allows Stripe and PostHog
    # Note: Modern browsers (Chrome/Brave) might still enforce local policies, 
    # but this explicitly authorizes our required services.
    csp_policy = (
        "default-src 'self'; "
        "script-src 'self' https://js.stripe.com https://m.stripe.network https://us.i.posthog.com 'unsafe-inline' 'unsafe-eval' blob:; "
        "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; "
        "img-src 'self' data: https://*.unsplash.com https://*.stripe.com; "
        "connect-src 'self' https://*.supabase.co https://*.stripe.com https://us.i.posthog.com ws: wss:; "
        "frame-src 'self' https://js.stripe.com; "
        "font-src 'self' https://fonts.gstatic.com;"
    )
    
    # Only set for HTML responses or entire App if needed
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
# We use prefix empty if the router already has its own prefix, but it's cleaner to standardize here.
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(resources.router, prefix="/resources", tags=["resources"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(ai.router) # /api/ai
api_router.include_router(courses.router) # /api/api/courses -> NEEDS FIX in courses.py
api_router.include_router(enrollments.router) # Needs fix if it has double prefix
api_router.include_router(media.router)

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