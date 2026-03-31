-- Support Chat and Trial Logic Adjustments
CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID DEFAULT auth.uid(),
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can only see/send their own messages" ON public.support_messages
FOR ALL USING (auth.uid() = sender_id);

-- Drop default from trial_ends_at to allow manual triggers during confirmation
ALTER TABLE public.profiles ALTER COLUMN trial_ends_at DROP DEFAULT;
