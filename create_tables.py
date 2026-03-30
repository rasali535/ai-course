import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
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
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

async def create_tables():
    if not DATABASE_URL:
        print("Error: DATABASE_URL not found in .env")
        return

    print(f"Connecting to database to create tables...")
    try:
        engine = create_async_engine(DATABASE_URL, echo=True)
        async with engine.begin() as conn:
            # This will create all tables defined in models that inherit from Base
            await conn.run_sync(Base.metadata.create_all)
        print("Successfully created all schema tables in Supabase!")
    except Exception as e:
        print(f"Failed to create tables: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(create_tables())
