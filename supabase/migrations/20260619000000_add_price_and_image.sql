-- Alter courses table to add price and image columns if they do not exist
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS price integer DEFAULT 1200;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS image text;

-- Update existing NULL rows to their default values
UPDATE public.courses SET price = 1200 WHERE price IS NULL;
UPDATE public.courses SET image = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3' WHERE image IS NULL;
