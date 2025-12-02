-- Additional demo data to complement the base brand/organizer/product seeds.
--
-- What it does:
--   • Upserts two extra brands (HydraFuel Labs, PlantPulse Snacks).
--   • Upserts two extra organizers (Immersive North Collective, Future Food Collective).
--   • Adds four sponsorship products mapped to those brands.
--
-- How to run:
--   1. Open the Supabase SQL editor (or use `supabase db remote commit`).
--   2. Paste the entire script.
--   3. Ensure the referenced demo auth users exist if you want rows tied to real user_ids.
--   4. Execute the block. Re-running it is safe; it removes/rebuilds the same rows.

DO $$
DECLARE
  brand_seed RECORD;
  organizer_seed RECORD;
  product_seed RECORD;
  brand_user_id UUID;
  organizer_user_id UUID;
  target_brand_id UUID;
BEGIN
  -- -----------------------------
  -- Brand seeds
  -- -----------------------------
  FOR brand_seed IN
    SELECT *
    FROM (
      VALUES
        (
          'hydrate@demo.com',
          'HydraFuel Labs',
          'Mikael Berg',
          'Head of Experiential Partnerships',
          '+46 70 777 2234',
          'https://hydrafuel.example.com',
          'Hammarby Allé 32',
          '120 63',
          'Stockholm',
          'health_wellness',
          'HydraFuel Lyte+ Concentrate',
          'Low-sugar electrolyte base engineered for on-site mixology bars and bike tour activations.',
          '480L (≈2,000 pours)',
          'Endurance athletes, hybrid workers, and wellness festival guests',
          '25-44',
          ARRAY['product_sampling', 'financial_sponsorship', 'experience']::text[],
          'Drive trial + SMS opt-ins ahead of the summer hydration roadshow.',
          '100000_250000',
          '250000_plus',
          true,
          'Up to SEK 400,000 per hero stop',
          'Opt-ins, pours/hour, influencer amplification',
          true,
          true,
          'Maintains 30-runner panel for seasonal SKU validation.',
          'Prefers eco-forward organizers with reliable cold-chain access.'
        ),
        (
          'plant@demo.com',
          'PlantPulse Snacks',
          'Elena Duarte',
          'Director of Field Marketing',
          '+46 70 331 8842',
          'https://plantpulse.example.com',
          'Kungsbro Strand 17',
          '112 26',
          'Stockholm',
          'food_beverage',
          'PlantPulse Savory Bites',
          'Protein-rich pea crisps in chef-developed flavors packaged for premium lounges and meetups.',
          '10,000 bite packs',
          'Flexitarian urban professionals and creative operators',
          '25-54',
          ARRAY['product_sampling', 'in_kind_goods', 'merchandise']::text[],
          'Launch new smoky paprika flavor with measurable trial-to-purchase lift.',
          '50000_100000',
          '100000_250000',
          false,
          '',
          'Trial-to-purchase uplift, QR-driven recipe downloads',
          true,
          false,
          '',
          'Offers plug-and-play merch booth kit with collapsible shelving.'
        )
    ) AS brand_data (
      email,
      company_name,
      contact_name,
      contact_title,
      phone,
      website,
      address,
      postal_code,
      city,
      industry,
      product_name,
      product_description,
      product_quantity,
      target_audience,
      age_range,
      sponsorship_type,
      marketing_goals,
      budget,
      event_marketing_budget,
      interested_in_financial_sponsorship,
      financial_sponsorship_amount,
      success_metrics,
      interested_in_sampling_tools,
      has_test_panels,
      test_panel_details,
      additional_info
    )
  LOOP
    SELECT id
      INTO brand_user_id
      FROM auth.users
     WHERE email = brand_seed.email
     ORDER BY created_at DESC
     LIMIT 1;

    DELETE FROM public.brands
          WHERE email = brand_seed.email;

    INSERT INTO public.brands (
      user_id,
      company_name,
      contact_name,
      contact_title,
      email,
      phone,
      website,
      address,
      postal_code,
      city,
      industry,
      product_name,
      product_description,
      product_quantity,
      target_audience,
      age_range,
      sponsorship_type,
      marketing_goals,
      budget,
      event_marketing_budget,
      interested_in_financial_sponsorship,
      financial_sponsorship_amount,
      success_metrics,
      interested_in_sampling_tools,
      has_test_panels,
      test_panel_details,
      additional_info,
      created_at,
      updated_at
    )
    VALUES (
      brand_user_id,
      brand_seed.company_name,
      brand_seed.contact_name,
      brand_seed.contact_title,
      brand_seed.email,
      brand_seed.phone,
      brand_seed.website,
      brand_seed.address,
      brand_seed.postal_code,
      brand_seed.city,
      brand_seed.industry,
      brand_seed.product_name,
      brand_seed.product_description,
      brand_seed.product_quantity,
      brand_seed.target_audience,
      brand_seed.age_range,
      brand_seed.sponsorship_type,
      brand_seed.marketing_goals,
      brand_seed.budget,
      brand_seed.event_marketing_budget,
      brand_seed.interested_in_financial_sponsorship,
      brand_seed.financial_sponsorship_amount,
      brand_seed.success_metrics,
      brand_seed.interested_in_sampling_tools,
      brand_seed.has_test_panels,
      brand_seed.test_panel_details,
      brand_seed.additional_info,
      TIMEZONE('utc', NOW()),
      TIMEZONE('utc', NOW())
    );
  END LOOP;

  -- -----------------------------
  -- Organizer seeds
  -- -----------------------------
  FOR organizer_seed IN
    SELECT *
    FROM (
      VALUES
        (
          '2b9c1f2d-0ee2-4b67-b25a-062eeb1c04cf'::uuid,
          'immersive@demo.com',
          'Immersive North Collective',
          'Jonas Eklund',
          '+46 70 990 4433',
          'https://immersivenorth.example.com',
          'Kyrkogatan 18',
          '411 15',
          'Göteborg',
          'Arctic Light Immersion Series',
          'series',
          'Quarterly pop-up that blends biohacking, light therapy, and culinary art above the Arctic Circle.',
          'quarterly',
          DATE '2025-02-15',
          'Luleå & Kiruna rotating venues',
          '500_1000',
          'Curated mix of wellness travelers, creative directors, and luxury hospitality buyers.',
          ARRAY['wellness travelers', 'premium event planners', 'luxury hospitality buyers']::text[],
          'Seeking hydration, skincare, and tech partners to co-build recovery domes + guided tasting rituals.',
          true,
          'SEK 200,000 - 350,000 depending on takeover scope',
          'Immersive "North Star" tier, spotlight tier, and lab residency packages.',
          ARRAY['brand_visibility', 'content_creation', 'lead_generation', 'product_sampling']::text[],
          '360° projection canvases, aurora-inspired catwalk, and light-route signage.',
          'On-site creator pit + 48-hour recap microsite delivered to partners.',
          'RFID-enabled check-ins feed partner CRM audiences same day.',
          'Post-event tastings streamed to VIP guests with instant polls.',
          ARRAY['vip_dinners', 'gift_bag_placement']::text[],
          'Includes scouting trips + ops playbooks for each city.',
          'Uses modular staging + mobile kitchens; logistics team already contracted.',
          ARRAY[
            'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
          ]::text[]
        ),
        (
          '9a079455-b175-4edb-b71f-63218b8ba9c4'::uuid,
          'market@demo.com',
          'Future Food Collective',
          'Aisha Ben Salem',
          '+46 72 888 0192',
          'https://futurefood.example.com',
          'Nytorget 6',
          '116 40',
          'Stockholm',
          'Future Food Weekender',
          'festival',
          'Open-air marketplace + lab kitchens showcasing climate-smart food makers.',
          'biannual',
          DATE '2025-09-06',
          'Färgfabriken, Stockholm',
          '1000_5000',
          'Food futurists, retailers, and culture press looking for the next breakout brand.',
          ARRAY['food innovators', 'retail buyers', 'culture media']::text[],
          'Need beverage, snack, and tech partners to underwrite tasting courts + content studio.',
          false,
          '',
          'Sponsorship ladders covering Main Stage, Lab Kitchen, and Creator Cam.',
          ARRAY['brand_visibility', 'content_creation', 'lead_generation', 'product_sampling']::text[],
          'Massive LED arch, tasting court marquees, and curated signage across lab pods.',
          'Daily recap reels + 15 snackable clips delivered within 48h.',
          'POS-ready QR kiosks capture shopper interest and route to partner stores.',
          'Taste-test juries with structured feedback for product teams.',
          ARRAY['panel_speaking_slots', 'retail_walkthroughs']::text[],
          'Includes curated retail walks + B2B buyer concierge.',
          'Licenses, chef labor, and sustainability compliance already covered by host team.',
          ARRAY[
            'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80'
          ]::text[]
        )
    ) AS organizer_data (
      organizer_id,
      email,
      organizer_name,
      contact_name,
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
      media_files
    )
  LOOP
    SELECT id
      INTO organizer_user_id
      FROM auth.users
     WHERE email = organizer_seed.email
     ORDER BY created_at DESC
     LIMIT 1;

    DELETE FROM public.organizers
          WHERE id = organizer_seed.organizer_id
             OR email = organizer_seed.email;

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
      organizer_seed.organizer_id,
      organizer_user_id,
      organizer_seed.organizer_name,
      organizer_seed.contact_name,
      organizer_seed.email,
      organizer_seed.phone,
      organizer_seed.website,
      organizer_seed.address,
      organizer_seed.postal_code,
      organizer_seed.city,
      organizer_seed.event_name,
      organizer_seed.event_type,
      organizer_seed.elevator_pitch,
      organizer_seed.event_frequency,
      organizer_seed.event_date,
      organizer_seed.location,
      organizer_seed.attendee_count,
      organizer_seed.audience_description,
      organizer_seed.audience_demographics,
      organizer_seed.sponsorship_needs,
      organizer_seed.seeking_financial_sponsorship,
      organizer_seed.financial_sponsorship_amount,
      organizer_seed.financial_sponsorship_offers,
      organizer_seed.offering_types,
      organizer_seed.brand_visibility,
      organizer_seed.content_creation,
      organizer_seed.lead_generation,
      organizer_seed.product_feedback,
      organizer_seed.bonus_value,
      organizer_seed.bonus_value_details,
      organizer_seed.additional_info,
      organizer_seed.media_files,
      TIMEZONE('utc', NOW()),
      TIMEZONE('utc', NOW())
    );
  END LOOP;

  -- -----------------------------
  -- Sponsorship products mapped to seeded brands
  -- -----------------------------
  FOR product_seed IN
    SELECT *
    FROM (
      VALUES
        (
          'hydrate@demo.com',
          'HydraFuel Recovery Mini-Bar',
          'Boost post-race experiences and capture SMS leads once runners finish.',
          120,
          'liters',
          'Roll-in unit with backlit counter, dual blenders, compostable cups, and lead capture tablets.',
          'online',
          jsonb_build_array(
            jsonb_build_object('id', 'hydrafuel-bar', 'url', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80')
          ),
          0
        ),
        (
          'hydrate@demo.com',
          'HydraFuel Chill Lounge Kit',
          'Create low-key rehydration lounges inside VIP or speaker areas.',
          6,
          'kits',
          'Includes ice wells, mist fans, branded soft seating, and NFC playlist triggers.',
          'online',
          jsonb_build_array(
            jsonb_build_object('id', 'hydrafuel-lounge', 'url', 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80')
          ),
          1
        ),
        (
          'plant@demo.com',
          'PlantPulse Flavor Lab',
          'Stage interactive tasting flights with chef hosts and survey capture.',
          4,
          'labs',
          'Modular counter, induction warmers, vegan plating kit, and bilingual host scripts.',
          'online',
          jsonb_build_array(
            jsonb_build_object('id', 'plantpulse-lab', 'url', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80')
          ),
          0
        ),
        (
          'plant@demo.com',
          'PlantPulse Crowd Crave Crates',
          'Flood general admission with single-serve packs and recipe cards.',
          8000,
          'packs',
          'Includes collapsible sampling crates, QR-ready wobblers, and brand ambassador playbooks.',
          'online',
          jsonb_build_array(
            jsonb_build_object('id', 'plantpulse-crate', 'url', 'https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?auto=format&fit=crop&w=800&q=80')
          ),
          1
        )
    ) AS product_data (
      brand_email,
      name,
      goals,
      quantity,
      unit,
      details,
      status,
      images,
      order_index
    )
  LOOP
    SELECT id
      INTO target_brand_id
      FROM public.brands
     WHERE email = product_seed.brand_email
     ORDER BY created_at DESC
     LIMIT 1;

    IF target_brand_id IS NULL THEN
      RAISE NOTICE 'Skipping product % because no brand exists for %.', product_seed.name, product_seed.brand_email;
    ELSE
      DELETE FROM public.sponsorship_products
            WHERE brand_id = target_brand_id
              AND name = product_seed.name;

      INSERT INTO public.sponsorship_products (
        brand_id,
        name,
        goals,
        quantity,
        unit,
        details,
        status,
        images,
        order_index,
        created_at,
        updated_at
      )
      VALUES (
        target_brand_id,
        product_seed.name,
        product_seed.goals,
        product_seed.quantity,
        product_seed.unit,
        product_seed.details,
        product_seed.status,
        product_seed.images,
        product_seed.order_index,
        TIMEZONE('utc', NOW()),
        TIMEZONE('utc', NOW())
      );
    END IF;
  END LOOP;
END $$;
