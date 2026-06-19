-- 1. Clean up duplicate enrollments, keeping the newest one
DELETE FROM public.enrollments a
USING public.enrollments b
WHERE a.ctid < b.ctid 
  AND a.user_id = b.user_id 
  AND a.course_id = b.course_id;

-- 2. Clean up duplicate published courses, keeping the newest one
DELETE FROM public.courses a
USING public.courses b
WHERE a.ctid < b.ctid 
  AND a.parent_id = b.parent_id 
  AND a.status = 'published' 
  AND b.status = 'published'
  AND a.parent_id IS NOT NULL;

-- 3. Add unique index for enrollments
CREATE UNIQUE INDEX IF NOT EXISTS enrollments_user_id_course_id_idx ON public.enrollments (user_id, course_id);

-- 4. Add unique index for published courses of a parent draft
CREATE UNIQUE INDEX IF NOT EXISTS courses_parent_id_published_idx ON public.courses (parent_id) WHERE status = 'published';
