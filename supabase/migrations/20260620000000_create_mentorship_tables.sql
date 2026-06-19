-- Migration: Create Mentorship Programs and Sessions Tables

-- 1. Create Mentorship Programs Table
CREATE TABLE IF NOT EXISTS public.mentorship_programs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  duration_minutes integer DEFAULT 60 NOT NULL,
  price integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Create Mentorship Sessions Table
CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id uuid REFERENCES public.mentorship_programs(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scheduled_time timestamp with time zone NOT NULL,
  status text DEFAULT 'confirmed' NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'canceled')),
  meeting_link text,
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Index foreign keys for performance
CREATE INDEX IF NOT EXISTS mentorship_programs_instructor_id_idx ON public.mentorship_programs (instructor_id);
CREATE INDEX IF NOT EXISTS mentorship_sessions_program_id_idx ON public.mentorship_sessions (program_id);
CREATE INDEX IF NOT EXISTS mentorship_sessions_student_id_idx ON public.mentorship_sessions (student_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.mentorship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;

-- Define Policies for Mentorship Programs
DROP POLICY IF EXISTS "Anyone can view mentorship programs" ON public.mentorship_programs;
CREATE POLICY "Anyone can view mentorship programs" ON public.mentorship_programs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Instructors can create mentorship programs" ON public.mentorship_programs;
CREATE POLICY "Instructors can create mentorship programs" ON public.mentorship_programs
  FOR INSERT WITH CHECK ((select auth.uid()) = instructor_id);

DROP POLICY IF EXISTS "Instructors can edit own mentorship programs" ON public.mentorship_programs;
CREATE POLICY "Instructors can edit own mentorship programs" ON public.mentorship_programs
  FOR UPDATE USING ((select auth.uid()) = instructor_id);

DROP POLICY IF EXISTS "Instructors can delete own mentorship programs" ON public.mentorship_programs;
CREATE POLICY "Instructors can delete own mentorship programs" ON public.mentorship_programs
  FOR DELETE USING ((select auth.uid()) = instructor_id);

-- Define Policies for Mentorship Sessions
DROP POLICY IF EXISTS "Users can view own sessions" ON public.mentorship_sessions;
CREATE POLICY "Users can view own sessions" ON public.mentorship_sessions
  FOR SELECT USING (
    (select auth.uid()) = student_id OR
    (select auth.uid()) IN (
      SELECT instructor_id FROM public.mentorship_programs WHERE id = program_id
    )
  );

DROP POLICY IF EXISTS "Students can book sessions" ON public.mentorship_sessions;
CREATE POLICY "Students can book sessions" ON public.mentorship_sessions
  FOR INSERT WITH CHECK ((select auth.uid()) = student_id);

DROP POLICY IF EXISTS "Participants can update sessions" ON public.mentorship_sessions;
CREATE POLICY "Participants can update sessions" ON public.mentorship_sessions
  FOR UPDATE USING (
    (select auth.uid()) = student_id OR
    (select auth.uid()) IN (
      SELECT instructor_id FROM public.mentorship_programs WHERE id = program_id
    )
  );

-- Grant Permissions
GRANT ALL ON public.mentorship_programs TO service_role;
GRANT ALL ON public.mentorship_sessions TO service_role;
