import sqlalchemy
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

# Import the Base and all models to ensure they are registered with the metadata
from backend.sql_database import Base
import backend.sql_models
import backend.course_model
import backend.enrollment_model

# Load environment variables
load_dotenv('backend/.env')

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and "?" in DATABASE_URL.split("@")[0]: # Only replace in the user:pass part
    user_pass, rest = DATABASE_URL.split("@", 1)
    user_pass = user_pass.replace("?", "%3F")
    DATABASE_URL = f"{user_pass}@{rest}"

# Use sync driver for initialization
if DATABASE_URL and DATABASE_URL.startswith("postgresql+asyncpg://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://", 1)
elif DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    pass # already sync

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
    except Exception as e:
        print(f"Failed to create tables: {e}")

if __name__ == "__main__":
    create_tables()
