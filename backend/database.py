# This file is deprecated. 
# The application has been migrated to use Supabase (PostgreSQL) via backend/sql_database.py.
# Please do not use this file for new features.

# Original content for reference:
# from motor.motor_asyncio import AsyncIOMotorClient
# import os
# from dotenv import load_dotenv
# from pathlib import Path
# 
# ROOT_DIR = Path(__file__).parent
# load_dotenv(ROOT_DIR / '.env')
# 
# mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
# db_name = os.environ.get('DB_NAME', 'ai_course_db')
# 
# client = AsyncIOMotorClient(mongo_url)
# db = client[db_name]
# 
# async def close_mongo_connection():
#     client.close()
