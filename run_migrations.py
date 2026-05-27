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

# Supabase project ref from the DATABASE_URL
project_ref = "gcxpgwywpesalfbkeakm" 
password = "Aliana12##2"
quoted_password = quote(password)

# Connection URIs to try:
# 1. Pooler on port 6543 (transaction mode) - supports IPv4
# 2. Pooler on port 5432 (session mode) - supports IPv4
# 3. Direct connection URL from .env
urls_to_try = [
    f"postgresql://postgres.{project_ref}:{quoted_password}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require",
    f"postgresql://postgres.{project_ref}:{quoted_password}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require",
    DATABASE_URL
]

conn = None
for i, url in enumerate(urls_to_try):
    # Hide password in logs
    masked_url = url.replace(quoted_password, "********").replace("Aliana202x%40", "********")
    print(f"Attempting connection {i+1} to: {masked_url}...")
    try:
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        conn = psycopg2.connect(url)
        conn.autocommit = False  # Use transactions
        print("Successfully connected!")
        break
    except Exception as e:
        print(f"Connection {i+1} failed: {e}\n")

if not conn:
    print("Error: All database connection attempts failed.")
    exit(1)

cursor = conn.cursor()
migration_dir = "supabase/migrations"
migration_files = sorted([f for f in os.listdir(migration_dir) if f.endswith(".sql")])

print(f"Found {len(migration_files)} migration files in {migration_dir}.")

for filename in migration_files:
    filepath = os.path.join(migration_dir, filename)
    print(f"\n--- Running migration: {filename} ---")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            sql = f.read()
        
        # Execute the SQL commands
        cursor.execute(sql)
        conn.commit()
        print(f"SUCCESS: {filename} applied.")
    except Exception as e:
        conn.rollback()
        print(f"ERROR running {filename}: {e}")
        # Continue or abort? Usually abort on first error
        print("Aborting remaining migrations.")
        break

cursor.close()
conn.close()
print("\nMigration run finished.")
