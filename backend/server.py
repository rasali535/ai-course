from fastapi import FastAPI, APIRouter
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
raw_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:8080,https://pohei.de,https://www.pohei.de,https://u723774100.pohei.de')
origins = [origin.strip() for origin in raw_origins.split(',') if origin.strip()]

# Credentials (cookies) are only allowed if we have explicit origins.
# If '*' is used, Starlette/FastAPI will fail if allow_credentials=True.
allow_all = "*" in origins
credentials_allowed = not allow_all

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=credentials_allowed,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Router
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "Welcome to AI Course Backend"}

# Include sub-routers under /api
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(resources.router, prefix="/resources", tags=["resources"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(ai.router)
api_router.include_router(courses.router)
api_router.include_router(enrollments.router)
api_router.include_router(media.router)

app.include_router(api_router)

# Mount static files (at the end so API takes precedence)
static_path = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_path):
    app.mount("/", StaticFiles(directory=static_path, html=True), name="static")
elif os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")


# Events
@app.on_event("startup")
async def startup_event():
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created/verified successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        logger.warning("Application starting WITHOUT database connection. Some features may be limited.")

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)