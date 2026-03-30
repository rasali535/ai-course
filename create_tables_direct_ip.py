import sqlalchemy
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
import traceback
from urllib.parse import quote

# Import the Base and all models to ensure they are registered with the metadata
from backend.sql_database import Base
import backend.sql_models
import backend.course_model
import backend.enrollment_model

# Load environment variables
load_dotenv('backend/.env')

# Exact IPv6 from nslookup
DIRECT_IP_HOST = "[2a05:d018:135e:16c1:8741:7ec5:e0fd:3864]"
# URL encode the password to handle any special characters like ? or @
password = quote("pMfv7?4.SbU.4yK")
DATABASE_URL = f"postgresql://postgres:{password}@{DIRECT_IP_HOST}:5432/postgres"

def create_tables():
    print(f"Connecting to database via direct IPv6: {DIRECT_IP_HOST}...")
    try:
        # We need to tell psycopg2 to connect to this direct IP
        engine = create_engine(DATABASE_URL, echo=True)
        Base.metadata.create_all(engine)
        print("Successfully created all schema tables in Supabase (Synchronously via direct IP)!")
    except Exception:
        print("Failed to create tables via direct IP:")
        traceback.print_exc()

if __name__ == "__main__":
    create_tables()
