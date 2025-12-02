-- Seed demo community members so discover pages can pull real data from Supabase.
--
-- How to run:
--   1. Open the Supabase SQL editor (or run via `supabase db remote commit`).
--   2. Paste this entire script and execute it.
--   3. Re-run anytime you want to refresh the showcase/demo data.
--
-- Notes:
--   • The script links each community member to an auth user when the email exists.
--   • Existing rows that use the same email are removed before inserting fresh data.
--   • Feel free to tweak the copy, imagery, or featured flags to match your demo story.

DO $$
DECLARE
  member RECORD;
  resolved_user_id UUID;
BEGIN
  FOR member IN
    SELECT *
    FROM (
      VALUES
        (
          'brand',
          'EcoRefresh Beverages',
          'brand@demo.com',
          true,
          'https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=600&q=80',
          'Organic hydration brand activating mindful tastings across the Nordics.',
          'EcoRefresh pairs low-sugar sparkling infusions with immersive sampling lounges across Stockholm and Gothenburg. Their roadshow focuses on health-conscious commuters and boutique fitness studios seeking premium hydration partners.',
          'https://ecorefresh.example.com',
          '+46 70 123 4567',
          E'https://instagram.com/ecorefresh\nhttps://linkedin.com/company/ecorefresh'
        ),
        (
          'brand',
          'HydraFuel Labs',
          'hydrate@demo.com',
          false,
          'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=600&q=80',
          'Performance hydration concentrates engineered for endurance tour pop-ups.',
          'HydraFuel Labs supports bike tours and trail events with on-site mixology counters, data-rich QR opt-ins, and staffed recovery lounges that convert sweaty finish lines into high-energy sampling theaters.',
          'https://hydrafuel.example.com',
          '+46 70 777 2234',
          E'https://instagram.com/hydrafuellabs\nhttps://linkedin.com/company/hydrafuel'
        ),
        (
          'brand',
          'PlantPulse Snacks',
          'plant@demo.com',
          true,
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
          'Chef-developed pea crisps built for lounge placements and curated tasting flights.',
          'PlantPulse Snacks co-creates flavor labs at fashion weeks and design summits. Their ambassadors host guided tastings, capture instant sentiment via NFC cards, and drive recipe downloads that nurture retail conversions.',
          'https://plantpulse.example.com',
          '+46 70 331 8842',
          E'https://instagram.com/plantpulse\nhttps://linkedin.com/company/plantpulse'
        ),
        (
          'brand',
          'GlowLab Beauty Collective',
          'glowlab@demo.com',
          false,
          'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=600&q=80',
          'Clean skincare studio bringing sensory bars and express facials to premium events.',
          'GlowLab activates “skin energy stations” at wellness retreats and VC demo days. Each touchpoint blends express facials, AI-powered diagnostics, and influencer-ready photo sets to spark UGC and VIP conversions.',
          'https://glowlab.example.com',
          '+46 72 555 9090',
          E'https://instagram.com/glowlabbeauty\nhttps://pinterest.com/glowlab'
        ),
        (
          'organizer',
          'Immersive North Collective',
          'immersive@demo.com',
          true,
          'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=600&q=80',
          'Arctic light therapy pop-up series blending biohacking, culinary art, and live music.',
          'The collective tours Luleå, Kiruna, and Tromsø with guided breathwork domes, projection runways, and chef-led tasting rituals. They welcome hydration, skincare, and tech sponsors who crave cinematic brand theater.',
          'https://immersivenorth.example.com',
          '+46 70 990 4433',
          E'https://instagram.com/immersivenorth\nhttps://linkedin.com/company/immersive-north'
        ),
        (
          'organizer',
          'Future Food Collective',
          'market@demo.com',
          false,
          'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?auto=format&fit=crop&w=600&q=80',
          'Biannual festival turning Färgfabriken into a climate-smart tasting court.',
          'Future Food Collective curates lab kitchens, investor walk-throughs, and creator studios so next-gen food makers can launch with measurable sell-through. Sponsors tap daily recap reels and QR kiosks that push shoppers straight to stores.',
          'https://futurefood.example.com',
          '+46 72 888 0192',
          E'https://instagram.com/futurefoodcollective\nhttps://linkedin.com/company/future-food'
        ),
        (
          'organizer',
          'Urban Wellness Week',
          'wellness@demo.com',
          true,
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
          'Seven-day city takeover featuring rooftop yoga, silent discos, and sensory lounges.',
          'Urban Wellness Week stretches across Stockholm rooftops and waterfront boardwalks, giving brands turnkey zones for sunrise yoga, ice-bath challenges, and data-rich sampling lines that keep audiences moving.',
          'https://urbanwellness.example.com',
          '+46 73 640 8877',
          E'https://instagram.com/urbanwellnessweek\nhttps://tiktok.com/@urbanwellnessweek'
        )
    ) AS seed (
      member_type,
      member_name,
      member_email,
      member_featured,
      member_logo,
      member_short_desc,
      member_description,
      member_website,
      member_phone,
      member_social_links
    )
  LOOP
    SELECT id
      INTO resolved_user_id
      FROM auth.users
     WHERE email = member.member_email
     ORDER BY created_at DESC
     LIMIT 1;

    DELETE FROM public.community_members
          WHERE email = member.member_email;

    INSERT INTO public.community_members (
      user_id,
      type,
      name,
      logo_url,
      short_description,
      description,
      website,
      email,
      phone,
      social_links,
      featured,
      date_registered
    )
    VALUES (
      resolved_user_id,
      member.member_type,
      member.member_name,
      member.member_logo,
      member.member_short_desc,
      member.member_description,
      member.member_website,
      member.member_email,
      member.member_phone,
      member.member_social_links,
      COALESCE(member.member_featured, false),
      TIMEZONE('utc', NOW())
    );
  END LOOP;
END $$;
