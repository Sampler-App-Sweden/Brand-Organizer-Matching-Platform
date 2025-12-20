-- Migration: Add Indexes for Interest Queries
-- Description: Adds indexes to optimize interest loading performance
-- Date: 2025-12-20

-- Index for finding interests by sender (getSentInterests)
CREATE INDEX IF NOT EXISTS idx_interests_sender_id
ON public.interests(sender_id, status, created_at DESC);

-- Index for finding interests by receiver (getReceivedInterests)
CREATE INDEX IF NOT EXISTS idx_interests_receiver_id
ON public.interests(receiver_id, status, created_at DESC);

-- Index for mutual interest checks (bidirectional lookup)
CREATE INDEX IF NOT EXISTS idx_interests_sender_receiver
ON public.interests(sender_id, receiver_id, status);

-- Index for reverse mutual interest checks
CREATE INDEX IF NOT EXISTS idx_interests_receiver_sender
ON public.interests(receiver_id, sender_id, status);

-- Index for batch AI match lookups
CREATE INDEX IF NOT EXISTS idx_matches_brand_organizer_source
ON public.matches(brand_id, organizer_id, match_source)
WHERE match_source = 'ai';

-- Index for brand lookups by ID (batch fetching)
CREATE INDEX IF NOT EXISTS idx_brands_id
ON public.brands(id) INCLUDE (company_name, user_id);

-- Index for organizer lookups by ID (batch fetching)
CREATE INDEX IF NOT EXISTS idx_organizers_id
ON public.organizers(id) INCLUDE (organizer_name, user_id);
