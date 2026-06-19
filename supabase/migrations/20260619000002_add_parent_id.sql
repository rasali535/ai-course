-- Alter courses table to add parent_id column if it does not exist
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS parent_id uuid;
