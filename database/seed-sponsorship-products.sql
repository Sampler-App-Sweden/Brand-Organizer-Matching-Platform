-- Seed demo sponsorship products for the EcoRefresh brand account.
--
-- How to use:
--   1. Open the Supabase SQL editor (or run via `supabase db remote commit`).
--   2. Paste this entire block.
--   3. Update DEMO_BRAND_EMAIL if you want to seed a different brand.
--   4. Run the script. Re-running it will wipe and recreate the brand's
--      sponsorship_products entries so the dashboard always has predictable data.

DO $$
DECLARE
  DEMO_BRAND_EMAIL TEXT := 'brand@demo.com';
  target_brand_id UUID;
BEGIN
  SELECT id
    INTO target_brand_id
    FROM public.brands
   WHERE email = DEMO_BRAND_EMAIL
   ORDER BY created_at DESC
   LIMIT 1;

  IF target_brand_id IS NULL THEN
    RAISE EXCEPTION 'No brand found with email % – create the demo brand first.', DEMO_BRAND_EMAIL;
  END IF;

  -- Keep the dataset idempotent so repeated runs reset the same records
  DELETE FROM public.sponsorship_products
        WHERE brand_id = target_brand_id;

  INSERT INTO public.sponsorship_products
    (brand_id, name, goals, quantity, unit, details, status, images, order_index)
  VALUES
    (
      target_brand_id,
      'EcoRefresh Event Starter Pack',
      'Drive top-of-funnel awareness and capture QR signups during tastings.',
      240,
      'cans',
      'Four classic flavors + recyclable tasting cups. Ships cold within Sweden.',
      'online',
      jsonb_build_array(
        jsonb_build_object('id', 'starter-pack', 'url', 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=600&q=80')
      ),
      0
    ),
    (
      target_brand_id,
      'Hydration Lounge Experience Kit',
      'Activate mid-funnel engagement via staffed hydration lounge or VIP area.',
      3,
      'kits',
      'Each kit includes branded bar backdrop, LED menu board, sampling fridge, and NFC survey tablets.',
      'online',
      jsonb_build_array(
        jsonb_build_object('id', 'lounge-kit', 'url', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80')
      ),
      1
    ),
    (
      target_brand_id,
      'Post-Event Follow-Up Bundle',
      'Collect feedback and convert attendees with day-2 drip incentives.',
      500,
      'codes',
      'Unique 20% discount codes, templated emails, and SMS copy to fuel retargeting.',
      'online',
      jsonb_build_array(
        jsonb_build_object('id', 'follow-up', 'url', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80')
      ),
      2
    );
END $$;
