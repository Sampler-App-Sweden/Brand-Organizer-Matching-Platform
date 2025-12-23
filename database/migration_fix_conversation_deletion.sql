-- Migration: Fix conversation deletion issue
-- This migration adds missing columns and RLS policies for conversations

-- Add archive-related columns to conversations table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'conversations'
    AND column_name = 'archived'
  ) THEN
    ALTER TABLE public.conversations ADD COLUMN archived BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'conversations'
    AND column_name = 'read_only'
  ) THEN
    ALTER TABLE public.conversations ADD COLUMN read_only BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'conversations'
    AND column_name = 'archived_at'
  ) THEN
    ALTER TABLE public.conversations ADD COLUMN archived_at TIMESTAMP WITH TIME ZONE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'conversations'
    AND column_name = 'archived_by'
  ) THEN
    ALTER TABLE public.conversations ADD COLUMN archived_by UUID REFERENCES auth.users ON DELETE SET NULL;
  END IF;
END $$;

-- Add missing RLS policies for conversations

-- UPDATE policy
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

-- DELETE policy (THIS WAS MISSING - causing the bug!)
DROP POLICY IF EXISTS "Allow users to delete their conversations" ON public.conversations;
CREATE POLICY "Allow users to delete their conversations"
  ON public.conversations FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.brands WHERE id = brand_id
      UNION
      SELECT user_id FROM public.organizers WHERE id = organizer_id
    )
  );
