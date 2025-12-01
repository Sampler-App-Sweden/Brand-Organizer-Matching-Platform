-- Create drafts table for saving incomplete registrations
CREATE TABLE IF NOT EXISTS public.drafts (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  type TEXT NOT NULL CHECK (type IN ('brand', 'organizer')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON public.drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_drafts_email ON public.drafts(email);
CREATE INDEX IF NOT EXISTS idx_drafts_type ON public.drafts(type);

-- Enable Row Level Security
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own drafts" ON public.drafts;
DROP POLICY IF EXISTS "Users can insert their own drafts" ON public.drafts;
DROP POLICY IF EXISTS "Users can update their own drafts" ON public.drafts;
DROP POLICY IF EXISTS "Users can delete their own drafts" ON public.drafts;
DROP POLICY IF EXISTS "Allow anonymous to view drafts by email" ON public.drafts;

-- Create RLS policies
-- Allow users to view their own drafts
CREATE POLICY "Users can view their own drafts"
ON public.drafts FOR SELECT
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND email IS NOT NULL)
);

-- Allow users to insert their own drafts
CREATE POLICY "Users can insert their own drafts"
ON public.drafts FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR 
  auth.uid() IS NULL
);

-- Allow users to update their own drafts
CREATE POLICY "Users can update their own drafts"
ON public.drafts FOR UPDATE
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND email IS NOT NULL)
);

-- Allow users to delete their own drafts
CREATE POLICY "Users can delete their own drafts"
ON public.drafts FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_drafts_updated_at_trigger ON public.drafts;
CREATE TRIGGER update_drafts_updated_at_trigger
  BEFORE UPDATE ON public.drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_drafts_updated_at();
