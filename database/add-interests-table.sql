-- Migration: Add interests table and update matches table for manual interest expression
-- Description: Creates interests table for tracking one-way and mutual interests between brands/organizers
-- Author: Claude
-- Date: 2025-12-19

-- Step 1: Create interests table
CREATE TABLE IF NOT EXISTS public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('brand', 'organizer')),
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_type TEXT NOT NULL CHECK (receiver_type IN ('brand', 'organizer')),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  organizer_id UUID REFERENCES public.organizers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT no_self_interest CHECK (sender_id != receiver_id),
  CONSTRAINT unique_interest UNIQUE (sender_id, receiver_id)
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_interests_sender ON public.interests(sender_id, status);
CREATE INDEX IF NOT EXISTS idx_interests_receiver ON public.interests(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_interests_brand_organizer ON public.interests(brand_id, organizer_id);
CREATE INDEX IF NOT EXISTS idx_interests_created_at ON public.interests(created_at DESC);

-- Step 3: Enable Row Level Security
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies

-- Users can create interests they send
CREATE POLICY "Users can create interests they send"
ON public.interests
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Users can view interests they sent
CREATE POLICY "Users can view sent interests"
ON public.interests
FOR SELECT
USING (auth.uid() = sender_id);

-- Users can view interests they received
CREATE POLICY "Users can view received interests"
ON public.interests
FOR SELECT
USING (auth.uid() = receiver_id);

-- Users can update status on interests they received (to accept/reject)
CREATE POLICY "Users can respond to received interests"
ON public.interests
FOR UPDATE
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

-- Users can delete/withdraw interests they sent (if pending)
CREATE POLICY "Users can withdraw sent interests"
ON public.interests
FOR DELETE
USING (auth.uid() = sender_id AND status = 'pending');

-- Step 5: Update matches table to add match_source column
ALTER TABLE public.matches
ADD COLUMN IF NOT EXISTS match_source TEXT DEFAULT 'ai'
CHECK (match_source IN ('ai', 'manual', 'hybrid'));

-- Step 6: Create index on match_source for filtering
CREATE INDEX IF NOT EXISTS idx_matches_source ON public.matches(match_source);

-- Step 7: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_interests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create trigger to auto-update updated_at
CREATE TRIGGER update_interests_updated_at_trigger
BEFORE UPDATE ON public.interests
FOR EACH ROW
EXECUTE FUNCTION public.update_interests_updated_at();

-- Step 9: Add comments for documentation
COMMENT ON TABLE public.interests IS 'Stores manual interest expressions between brands and organizers';
COMMENT ON COLUMN public.interests.sender_id IS 'User ID of the person expressing interest';
COMMENT ON COLUMN public.interests.receiver_id IS 'User ID of the person receiving the interest';
COMMENT ON COLUMN public.interests.status IS 'Status of the interest: pending, accepted, rejected, or withdrawn';
COMMENT ON COLUMN public.matches.match_source IS 'Source of match creation: ai (algorithm), manual (user interest), or hybrid (both)';
