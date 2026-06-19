import os
import psycopg2
from dotenv import load_dotenv
from urllib.parse import quote

# Load env variables from backend/.env
load_dotenv('backend/.env')

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL not found in backend/.env")
    exit(1)

project_ref = "gcxpgwywpesalfbkeakm" 
password = "Aliana12##2"
quoted_password = quote(password)

url = f"postgresql://postgres.{project_ref}:{quoted_password}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require"

try:
    conn = psycopg2.connect(url)
    cursor = conn.cursor()
    cursor.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'courses';")
    columns = cursor.fetchall()
    
    with open("inspect_output.txt", "w") as f:
        f.write("Columns in 'courses' table:\n")
        for col in columns:
            f.write(f" - {col[0]}: {col[1]}\n")
    print("Inspection success!")
except Exception as e:
    with open("inspect_output.txt", "w") as f:
        f.write(f"Error: {e}\n")
    print("Failed to inspect.")
