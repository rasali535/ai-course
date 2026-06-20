from fastapi import FastAPI, APIRouter, Request, Response
from starlette.middleware.cors import CORSMiddleware
from backend.limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import logging
import os
from fastapi.staticfiles import StaticFiles
from backend.sql_database import engine, Base
import backend.sql_models  # Ensure models are registered
import backend.course_model # Ensure course models are registered
import backend.enrollment_model # Ensure enrollment models are registered
import backend.mentorship_model # Ensure mentorship models are registered
import backend.podcast_model
from backend.routers import auth, resources, payments, courses, enrollments, media, ai, webhooks, mentorship, podcasts
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Rate Limiter Init
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
    
    # Comprehensive CSP policy
    # Tightened for production: limited default-src and clarified sources
    csp_policy = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.paypal.com https://m.stripe.network blob:; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://m.stripe.network https://www.paypal.com https://www.paypalobjects.com; "
        "img-src 'self' data: https://*.stripe.com https://www.paypalobjects.com https://m.stripe.network; "
        "connect-src 'self' https://api.stripe.com https://api-m.sandbox.paypal.com https://api-m.paypal.com https://www.paypal.com https://m.stripe.network; "
        "frame-src 'self' https://js.stripe.com https://www.paypal.com https://m.stripe.network https://www.paypalobjects.com; "
        "font-src 'self' https://fonts.gstatic.com;"
    )
    
    response.headers["Content-Security-Policy"] = csp_policy
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    
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
api_router.include_router(mentorship.router) # Already has /mentorship prefix
api_router.include_router(webhooks.router)
api_router.include_router(podcasts.router, prefix="/podcasts", tags=["podcasts"])

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
        try:
            logging.info("Attempting fallback to local SQLite database...")
            from backend import sql_database
            from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
            from sqlalchemy.orm import sessionmaker
            sqlite_url = "sqlite+aiosqlite:///./learnflow.db"
            sql_database.DATABASE_URL = sqlite_url
            sql_database.engine = create_async_engine(sqlite_url, echo=True)
            sql_database.AsyncSessionLocal = sessionmaker(
                sql_database.engine, class_=AsyncSession, expire_on_commit=False
            )
            async with sql_database.engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logging.info("Successfully initialized fallback SQLite database.")
        except Exception as sqlite_err:
            logging.error(f"Failed to initialize fallback SQLite: {sqlite_err}")
            logging.warning("Application starting WITHOUT database connection. Some features may be limited.")

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)