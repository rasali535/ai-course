import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv('backend/.env')

from backend.sql_database import Base
import backend.sql_models
import backend.course_model
import backend.enrollment_model
import backend.mentorship_model

db_url = os.getenv("DATABASE_URL")
print("Connecting to:", db_url.replace("Aliana12%23%232", "****"))

try:
    engine = create_engine(db_url, echo=True)
    Base.metadata.create_all(engine)
    print("Tables created successfully!")
except Exception as e:
    print(f"Error: {e}")
