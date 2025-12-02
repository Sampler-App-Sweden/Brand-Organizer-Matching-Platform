-- Seed demo organizer profile for the EcoRefresh sample workspace.
--
-- How to use:
--   1. Open the Supabase SQL editor (or run via `supabase db remote commit`).
--   2. Paste this entire block.
--   3. Ensure the demo organizer user (organizer@demo.com) exists in auth.
--   4. Run the script. Re-running it will wipe and recreate the organizer row
--      so the dashboard always has predictable demo data.

DO $$
DECLARE
  DEMO_ORGANIZER_EMAIL TEXT := 'organizer@demo.com';
  TARGET_ORGANIZER_ID UUID := '16b65be7-e18d-4ace-a8c5-6d24851a4bd5';
  target_user_id UUID;
BEGIN
  SELECT id
    INTO target_user_id
    FROM auth.users
   WHERE email = DEMO_ORGANIZER_EMAIL
   ORDER BY created_at DESC
   LIMIT 1;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found with email % – create the demo organizer first.', DEMO_ORGANIZER_EMAIL;
  END IF;

  -- Keep the dataset idempotent so repeated runs reset the same record
  DELETE FROM public.organizers
        WHERE id = TARGET_ORGANIZER_ID
           OR email = DEMO_ORGANIZER_EMAIL;

  INSERT INTO public.organizers (
    id,
    user_id,
    organizer_name,
    contact_name,
    email,
    phone,
    website,
    address,
    postal_code,
    city,
    event_name,
    event_type,
    elevator_pitch,
    event_frequency,
    event_date,
    location,
    attendee_count,
    audience_description,
    audience_demographics,
    sponsorship_needs,
    seeking_financial_sponsorship,
    financial_sponsorship_amount,
    financial_sponsorship_offers,
    offering_types,
    brand_visibility,
    content_creation,
    lead_generation,
    product_feedback,
    bonus_value,
    bonus_value_details,
    additional_info,
    media_files,
    created_at,
    updated_at
  )
  VALUES (
    TARGET_ORGANIZER_ID,
    target_user_id,
    'Nordic Experience Collective',
    'Sara Lindholm',
    DEMO_ORGANIZER_EMAIL,
    '+46 70 555 0102',
    'https://nordicexperience.example.com',
    'Sveavägen 98',
    '113 50',
    'Stockholm',
    'Eco Wellness Summit 2025',
    'conference',
    'Two-day summit connecting wellness brands with premium Nordic event organizers.',
    'annual',
    DATE '2025-05-24',
    'Stockholm Waterfront Congress Centre',
    '1000_5000',
    'Health-conscious urban professionals seeking regenerative and premium wellness experiences.',
    ARRAY['urban millennials', 'wellness enthusiasts', 'premium event planners']::text[],
    'Looking for beverage, tech, and experiential partners to co-create immersive hydration and recovery zones.',
    true,
    'SEK 150,000 - 250,000',
    'Tiered partnerships (Signature, Spotlight, Community) with bundled activation and media deliverables.',
    ARRAY['brand_visibility', 'content_creation', 'lead_generation', 'product_sampling']::text[],
    'Stage branding, kinetic LED walls, and welcome lounge takeovers for headline sponsors.',
    'Behind-the-scenes creator studio + day-two recap filmed on-site for partner reuse.',
    'NFC-powered attendee check-ins flowing straight into partner CRM lists (opt-in compliant).',
    'Guided tastings plus QR-triggered micro surveys for instant sentiment capture.',
    ARRAY['vip_dinners', 'gift_bag_placement', 'panel_speaking_slots']::text[],
    'Includes concierge introductions to ten top-tier venues and quarterly activation performance reviews.',
    'Production partner already secured; AV, staffing, and permit logistics handled by NEC ops pod.',
    ARRAY[
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1471201187657-6406da15e43b?auto=format&fit=crop&w=800&q=80'
    ]::text[],
    TIMEZONE('utc', NOW()),
    TIMEZONE('utc', NOW())
  );
END $$;
