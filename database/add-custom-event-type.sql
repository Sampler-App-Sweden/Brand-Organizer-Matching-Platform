-- Migration: Add custom_event_type column to events table
-- Description: Allows organizers to specify a custom event type when selecting "Other"

-- Add the custom_event_type column to the events table
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS custom_event_type TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN public.events.custom_event_type IS 'Custom event type entered by user when event_type is "other"';
