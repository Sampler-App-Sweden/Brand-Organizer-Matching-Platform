-- Add bidirectional sync between profiles and brands/organizers tables
-- This migration adds triggers to sync changes from brands/organizers back to profiles

-- Function to sync brand updates back to profiles
CREATE OR REPLACE FUNCTION public.sync_brand_to_profile()
RETURNS trigger AS $$
BEGIN
  -- Update profile when brand is updated
  UPDATE public.profiles
     SET name = COALESCE(NEW.company_name, name),
         email = COALESCE(NEW.email, email),
         phone = COALESCE(NEW.phone, phone),
         updated_at = NOW()
   WHERE id = NEW.user_id
     AND (
       name IS DISTINCT FROM COALESCE(NEW.company_name, name) OR
       email IS DISTINCT FROM COALESCE(NEW.email, email) OR
       phone IS DISTINCT FROM COALESCE(NEW.phone, phone)
     );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to sync organizer updates back to profiles
CREATE OR REPLACE FUNCTION public.sync_organizer_to_profile()
RETURNS trigger AS $$
BEGIN
  -- Update profile when organizer is updated
  UPDATE public.profiles
     SET name = COALESCE(NEW.organizer_name, name),
         email = COALESCE(NEW.email, email),
         phone = COALESCE(NEW.phone, phone),
         updated_at = NOW()
   WHERE id = NEW.user_id
     AND (
       name IS DISTINCT FROM COALESCE(NEW.organizer_name, name) OR
       email IS DISTINCT FROM COALESCE(NEW.email, email) OR
       phone IS DISTINCT FROM COALESCE(NEW.phone, phone)
     );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for brand → profile sync
DROP TRIGGER IF EXISTS sync_brand_to_profile_trigger ON public.brands;
CREATE TRIGGER sync_brand_to_profile_trigger
  AFTER UPDATE OF company_name, email, phone ON public.brands
  FOR EACH ROW
  WHEN (OLD IS DISTINCT FROM NEW)
  EXECUTE FUNCTION public.sync_brand_to_profile();

-- Create trigger for organizer → profile sync
DROP TRIGGER IF EXISTS sync_organizer_to_profile_trigger ON public.organizers;
CREATE TRIGGER sync_organizer_to_profile_trigger
  AFTER UPDATE OF organizer_name, email, phone ON public.organizers
  FOR EACH ROW
  WHEN (OLD IS DISTINCT FROM NEW)
  EXECUTE FUNCTION public.sync_organizer_to_profile();

-- Also add triggers for INSERT to ensure profiles are created/updated when brands/organizers are created
DROP TRIGGER IF EXISTS sync_brand_insert_to_profile_trigger ON public.brands;
CREATE TRIGGER sync_brand_insert_to_profile_trigger
  AFTER INSERT ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_brand_to_profile();

DROP TRIGGER IF EXISTS sync_organizer_insert_to_profile_trigger ON public.organizers;
CREATE TRIGGER sync_organizer_insert_to_profile_trigger
  AFTER INSERT ON public.organizers
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_organizer_to_profile();

-- Add comment for documentation
COMMENT ON FUNCTION public.sync_brand_to_profile() IS 'Syncs brand data (company_name, email, phone) back to profiles table';
COMMENT ON FUNCTION public.sync_organizer_to_profile() IS 'Syncs organizer data (organizer_name, email, phone) back to profiles table';
