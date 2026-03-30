import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os
from dotenv import load_dotenv

# Load env from parent dir if needed, but we are in the same dir as .env usually?
# Let's check where .env is. It's in backend/.env
# But wait, I'm probably in the root.
load_dotenv('backend/.env')

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

async def test_conn():
    print(f"Testing connection to: {DATABASE_URL}")
    try:
        engine = create_async_engine(DATABASE_URL)
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            print(f"Success! Result: {result.fetchone()}")
    except Exception as e:
        print(f"Failed to connect: {e}")

if __name__ == "__main__":
    asyncio.run(test_conn())
