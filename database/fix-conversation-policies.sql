-- Migration: Fix Conversation RLS Policies
-- Description: Adds missing UPDATE policy for conversations table to support archiving
-- Date: 2025-12-20

-- Add UPDATE policy for conversations (missing!)
DROP POLICY IF EXISTS "Allow users to update their conversations" ON public.conversations;
CREATE POLICY "Allow users to update their conversations"
  ON public.conversations FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.brands WHERE id = brand_id
      UNION
      SELECT user_id FROM public.organizers WHERE id = organizer_id
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.brands WHERE id = brand_id
      UNION
      SELECT user_id FROM public.organizers WHERE id = organizer_id
    )
  );
