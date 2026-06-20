import sqlalchemy
from sqlalchemy import create_engine
import os
import traceback
from urllib.parse import quote

# Import Base and models
from backend.sql_database import Base
import backend.sql_models
import backend.course_model
import backend.enrollment_model
import backend.mentorship_model
import backend.podcast_model

def create_tables():
    password = quote("Aliana202x@")
    
    # Try 1: Hostname connection
    hostname_url = f"postgresql://postgres:{password}@db.gcxpgwywpesalfbkeakm.supabase.co:5432/postgres"
    print("Attempting to connect via Hostname...")
    try:
        engine = create_engine(hostname_url, echo=True)
        Base.metadata.create_all(engine)
        print("Successfully created all schema tables in the new Supabase using Hostname connection!")
        return
    except Exception as e:
        print("Failed to connect via Hostname. Error:")
        print(str(e))
        
    # Try 2: Direct IPv6 connection
    ipv6_url = f"postgresql://postgres:{password}@[2a05:d018:5b7:f200:c94b:252e:7c59:a2f9]:5432/postgres"
    print("\nAttempting to connect via direct IPv6...")
    try:
        engine = create_engine(ipv6_url, echo=True)
        Base.metadata.create_all(engine)
        print("Successfully created all schema tables in the new Supabase using direct IPv6 connection!")
        return
    except Exception as e:
        print("Failed to connect via direct IPv6. Error:")
        print(str(e))
        traceback.print_exc()

if __name__ == "__main__":
    create_tables()
