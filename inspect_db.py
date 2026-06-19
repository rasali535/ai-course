import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

async def inspect():
    print(f"Connecting to: {DATABASE_URL}")
    engine = create_async_engine(DATABASE_URL)
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'courses';"))
            columns = result.fetchall()
            print("\nColumns in 'courses' table:")
            for col in columns:
                print(f" - {col[0]}: {col[1]}")
    except Exception as e:
        print(f"Error inspecting DB: {e}")

if __name__ == "__main__":
    asyncio.run(inspect())
