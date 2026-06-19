-- Alter courses table to add duration column if it does not exist
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration text DEFAULT '12h';

-- Update existing NULL rows to their default value
UPDATE public.courses SET duration = '12h' WHERE duration IS NULL;
