-- Migration: Add Interest Cleanup Fields
-- Description: Adds archival and inactive status fields to support interest withdrawal cleanup
-- Date: 2025-12-19

-- ============================================================================
-- 1. Extend matches table to support 'inactive' status
-- ============================================================================

ALTER TABLE public.matches
DROP CONSTRAINT IF EXISTS matches_status_check;

ALTER TABLE public.matches
ADD CONSTRAINT matches_status_check
CHECK (status IN ('pending', 'accepted', 'rejected', 'inactive'));

-- Index for filtering inactive matches
CREATE INDEX IF NOT EXISTS idx_matches_status_inactive
ON public.matches(status) WHERE status = 'inactive';

-- ============================================================================
-- 2. Add archival fields to conversations table
-- ============================================================================

ALTER TABLE public.conversations
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS read_only BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add column comments for documentation
COMMENT ON COLUMN public.conversations.archived IS 'Indicates conversation has been archived due to interest withdrawal';
COMMENT ON COLUMN public.conversations.read_only IS 'When true, prevents new messages (users can still read)';
COMMENT ON COLUMN public.conversations.archived_by IS 'User who initiated the archival (withdrew interest)';
COMMENT ON COLUMN public.conversations.archived_at IS 'Timestamp when conversation was archived';

-- Index for filtering archived conversations
CREATE INDEX IF NOT EXISTS idx_conversations_archived
ON public.conversations(archived) WHERE archived = true;

-- Index for active conversations (most common query)
CREATE INDEX IF NOT EXISTS idx_conversations_active
ON public.conversations(brand_id, organizer_id, archived) WHERE archived = false;

-- ============================================================================
-- 3. Update RLS policy to enforce read-only conversations
-- ============================================================================

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow users to insert messages in their conversations" ON public.messages;

-- Create new policy that respects read_only flag
CREATE POLICY "Allow users to insert messages in their conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT c.id FROM public.conversations c
      WHERE (c.brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid())
         OR c.organizer_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid()))
        AND c.read_only = false  -- Prevent messages in read-only conversations
    )
  );

-- ============================================================================
-- Verification Queries (run after migration to verify)
-- ============================================================================

-- Uncomment to run verification after migration:

-- -- Check that all conversations have archived field set
SELECT COUNT(*) as total_conversations,
        SUM(CASE WHEN archived IS NULL THEN 1 ELSE 0 END) as null_archived
 FROM public.conversations;
-- -- Expected: null_archived should be 0 

-- -- Check that matches constraint includes 'inactive'
SELECT conname, pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.matches'::regclass AND conname = 'matches_status_check';
-- -- Expected: CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'inactive'::text])))

-- -- Verify indexes were created
 SELECT indexname, indexdef
 FROM pg_indexes
 WHERE tablename IN ('matches', 'conversations')
   AND indexname IN ('idx_matches_status_inactive', 'idx_conversations_archived', 'idx_conversations_active');
-- -- Expected: 3 rows returned 
