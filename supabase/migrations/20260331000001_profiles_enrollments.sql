
-- Create Profiles Table Link to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE,
  hashed_password text,
  full_name text,
  role text DEFAULT 'learner' CHECK (role IN ('learner', 'creator', 'admin')),
  plan text DEFAULT 'basic',
  subscription_status text DEFAULT 'pending', 
  total_credits integer DEFAULT 0,
  trial_ends_at timestamp with time zone DEFAULT now() + interval '7 days',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Ensure email and hashed_password columns exist in public.profiles (for existing tables)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hashed_password text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_token text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = id);

-- Create Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  is_completed boolean DEFAULT false NOT NULL,
  is_paid boolean DEFAULT false NOT NULL,
  progress integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Index foreign keys for performance
CREATE INDEX IF NOT EXISTS enrollments_user_id_idx ON public.enrollments (user_id);
CREATE INDEX IF NOT EXISTS enrollments_course_id_idx ON public.enrollments (course_id);

-- Enable RLS on Enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Enrollments Policies
DROP POLICY IF EXISTS "Users can view their own enrollments." ON public.enrollments;
CREATE POLICY "Users can view their own enrollments." ON public.enrollments
  FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own enrollments." ON public.enrollments;
CREATE POLICY "Users can create their own enrollments." ON public.enrollments
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own enrollments." ON public.enrollments;
CREATE POLICY "Users can update their own enrollments." ON public.enrollments
  FOR UPDATE USING ((select auth.uid()) = user_id);

-- Profile Trigger for New Users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, plan, subscription_status)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'learner'),
    COALESCE(new.raw_user_meta_data->>'plan', 'basic'),
    CASE WHEN COALESCE(new.raw_user_meta_data->>'plan', 'basic') = 'basic' THEN 'active' ELSE 'pending' END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
