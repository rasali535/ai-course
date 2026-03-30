import sqlalchemy
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
import traceback

# Import the Base and all models to ensure they are registered with the metadata
from backend.sql_database import Base
import backend.sql_models
import backend.course_model
import backend.enrollment_model

# Load environment variables
load_dotenv('backend/.env')

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgresql+asyncpg://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://", 1)

def create_tables():
    if not DATABASE_URL:
        print("Error: DATABASE_URL not found in .env")
        return

    print(f"Connecting to database to create tables (SYNC mode)...")
    try:
        # Use sync engine with psycopg2
        engine = create_engine(DATABASE_URL, echo=True)
        Base.metadata.create_all(engine)
        print("Successfully created all schema tables in Supabase (Synchronously)!")
    except Exception:
        print("Failed to create tables:")
        traceback.print_exc()

if __name__ == "__main__":
    create_tables()
