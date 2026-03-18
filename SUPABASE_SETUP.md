# Setting up Database Tables in Supabase

Since we cannot directly execute SQL commands on your Supabase instance from here without the connection string, you need to run the following SQL query in your Supabase SQL Editor.

## Instructions

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. Go to the **SQL Editor** (icon on the left sidebar).
4. Click **New Query**.
5. Copy and paste the code below into the query editor.
6. Click **Run**.

## SQL Query

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users Table (for your custom Auth system)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    full_name TEXT,
    disabled BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Resources Table
CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

Once this is run, your **Users** table will be ready for Signup/Login, and **Resources** table will be ready for content.
