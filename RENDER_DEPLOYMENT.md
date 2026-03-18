# Deploying Backend to Render with Supabase

## Prerequisites

1. **Supabase Project**: Ensure you have a Supabase project created.
2. **Render Account**: Ensure you have a Render account.
3. **GitHub/GitLab/Bitbucket**: Your code needs to be in a repository connected to Render.

## Steps

### 1. Configure Supabase

1. Go to your Supabase Project Dashboard.
2. Navigate to **Settings** -> **Database**.
3. Under **Connection string**, make sure **URI** is selected.
4. Copy the connection string. It will look something like:
    `postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
    *Note: Replace `[YOUR-PASSWORD]` with your actual database password.*

### 2. Configure Render

1. Log in to your Render Dashboard.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Give your service a name (e.g., `ai-course-backend`).
5. **Runtime**: Select `Python 3`.
6. **Build Command**: `pip install -r backend/requirements.txt`
7. **Start Command**: `uvicorn backend.server:app --host 0.0.0.0 --port $PORT`
8. **Environment Variables**:
    * Add a new variable:
        * **Key**: `DATABASE_URL`
        * **Value**: Paste your Supabase connection string.
    * Add:
        * **Key**: `SUPABASE_URL`
        * **Value**: `https://ihhnptuelpofwferarjr.supabase.co`
    * Add:
        * **Key**: `SUPABASE_ANON_KEY`
        * **Value**: Paste the long string starting with `eyJ...` (provided in chat).
    * Add other keys from your local `.env` if needed (e.g., `GEMINI_API_KEY`).

    *(Note: My update to `backend/sql_database.py` automatically handles converting `postgres://` to `postgresql+asyncpg://` so you can use the standard string).*

### 3. Deploy

1. Click **Create Web Service**.
2. Render will start building your application.
3. Once deployed, your backend will be live at `https://ai-course-backend.onrender.com` (or similar).

## Important Note

* Your Codebase currently supports both SQL (via Supabase) and MongoDB (via `backend/database.py`).
* The Authentication (`auth.py`) currently uses MongoDB. If you don't provide a `MONGO_URL` env var, login/signup might fail.
* If you intend to migrate Authentication to Supabase (SQL), you will need to update `backend/routers/auth.py` to use `backend.sql_models.SQLUser` instead of MongoDB.
