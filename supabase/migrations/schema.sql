
-- schema.sql: Enhanced Courses Table with Draft/Publish Workflow
-- Supabase Migration Script

-- 1. Create/Update Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  content jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Ensure columns exist even if table was created previously
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Update existing NULL rows if any
UPDATE public.courses SET status = 'draft' WHERE status IS NULL;
UPDATE public.courses SET is_public = false WHERE is_public IS NULL;

-- Apply NOT NULL constraints now that data is clean
ALTER TABLE public.courses ALTER COLUMN status SET NOT NULL;
ALTER TABLE public.courses ALTER COLUMN is_public SET NOT NULL;

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- 3. Define Access Policies (with DROP IF EXISTS)

-- policy: users can select their own courses (any status)
DROP POLICY IF EXISTS "Users can view their own courses." ON public.courses;
CREATE POLICY "Users can view their own courses." 
  ON public.courses 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- policy: anyone can select published courses
DROP POLICY IF EXISTS "Anyone can view published courses." ON public.courses;
CREATE POLICY "Anyone can view published courses." 
  ON public.courses 
  FOR SELECT 
  USING (status = 'published' AND is_public = true);

-- policy: users can insert their own courses
DROP POLICY IF EXISTS "Users can create their own courses." ON public.courses;
CREATE POLICY "Users can create their own courses." 
  ON public.courses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- policy: users can update their own courses
DROP POLICY IF EXISTS "Users can update their own courses." ON public.courses;
CREATE POLICY "Users can update their own courses." 
  ON public.courses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- policy: users can delete their own courses
DROP POLICY IF EXISTS "Users can delete their own courses." ON public.courses;
CREATE POLICY "Users can delete their own courses." 
  ON public.courses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 4. Set up Auto-Update Trigger for updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = now();
  return new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_update_courses ON public.courses;
CREATE TRIGGER on_update_courses
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. Grant Permissions to Service Role
GRANT ALL ON public.courses TO service_role;
