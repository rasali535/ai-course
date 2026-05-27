from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/learnflow")

if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Handle sslmode query parameter which causes asyncpg to crash
connect_args = {}
if DATABASE_URL and "sslmode" in DATABASE_URL:
    import urllib.parse as urlparse
    url_parts = list(urlparse.urlparse(DATABASE_URL))
    query = dict(urlparse.parse_qsl(url_parts[4]))
    if "sslmode" in query:
        # If sslmode is require/prefer/allow, pass ssl=True to asyncpg
        if query["sslmode"] in ["require", "prefer", "allow"]:
            connect_args["ssl"] = True
        del query["sslmode"]
    url_parts[4] = urlparse.urlencode(query)
    DATABASE_URL = urlparse.urlunparse(url_parts)

engine = create_async_engine(DATABASE_URL, echo=True, connect_args=connect_args)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
