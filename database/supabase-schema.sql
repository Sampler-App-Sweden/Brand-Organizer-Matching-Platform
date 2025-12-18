-- Users table (extending Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('Brand', 'Organizer', 'Admin')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  logo_url TEXT,
  description TEXT,
  PRIMARY KEY (id)
);
-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Brands table
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_title TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  industry TEXT,
  product_name TEXT NOT NULL,
  product_description TEXT NOT NULL,
  product_quantity TEXT,
  target_audience TEXT NOT NULL,
  age_range TEXT NOT NULL,
  sponsorship_type TEXT[] NOT NULL,
  marketing_goals TEXT,
  budget TEXT NOT NULL,
  event_marketing_budget TEXT,
  interested_in_financial_sponsorship BOOLEAN DEFAULT false,
  financial_sponsorship_amount TEXT,
  success_metrics TEXT,
  interested_in_sampling_tools BOOLEAN DEFAULT false,
  has_test_panels BOOLEAN DEFAULT false,
  test_panel_details TEXT,
  additional_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
-- Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
-- Organizers table
CREATE TABLE IF NOT EXISTS public.organizers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  organizer_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
-- Enable RLS
ALTER TABLE public.organizers ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID REFERENCES public.organizers ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  elevator_pitch TEXT,
  frequency TEXT,
  start_date DATE,
  location TEXT,
  attendee_count TEXT,
  audience_description TEXT,
  audience_demographics TEXT[],
  sponsorship_needs TEXT,
  seeking_financial_sponsorship BOOLEAN DEFAULT false,
  financial_sponsorship_amount TEXT,
  financial_sponsorship_offers TEXT,
  offering_types TEXT[],
  brand_visibility TEXT,
  content_creation TEXT,
  lead_generation TEXT,
  product_feedback TEXT,
  bonus_value TEXT[],
  bonus_value_details TEXT,
  additional_info TEXT,
  media_files TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'organizers'
       AND column_name = 'event_name'
  ) THEN
    INSERT INTO public.events (
      organizer_id,
      name,
      event_type,
      elevator_pitch,
      frequency,
      start_date,
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
    SELECT
      id,
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
    FROM public.organizers;

    ALTER TABLE public.organizers
      DROP COLUMN IF EXISTS event_name,
      DROP COLUMN IF EXISTS event_type,
      DROP COLUMN IF EXISTS elevator_pitch,
      DROP COLUMN IF EXISTS event_frequency,
      DROP COLUMN IF EXISTS event_date,
      DROP COLUMN IF EXISTS location,
      DROP COLUMN IF EXISTS attendee_count,
      DROP COLUMN IF EXISTS audience_description,
      DROP COLUMN IF EXISTS audience_demographics,
      DROP COLUMN IF EXISTS sponsorship_needs,
      DROP COLUMN IF EXISTS seeking_financial_sponsorship,
      DROP COLUMN IF EXISTS financial_sponsorship_amount,
      DROP COLUMN IF EXISTS financial_sponsorship_offers,
      DROP COLUMN IF EXISTS offering_types,
      DROP COLUMN IF EXISTS brand_visibility,
      DROP COLUMN IF EXISTS content_creation,
      DROP COLUMN IF EXISTS lead_generation,
      DROP COLUMN IF EXISTS product_feedback,
      DROP COLUMN IF EXISTS bonus_value,
      DROP COLUMN IF EXISTS bonus_value_details,
      DROP COLUMN IF EXISTS additional_info,
      DROP COLUMN IF EXISTS media_files;
  END IF;
END $$;
-- Matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES public.brands ON DELETE CASCADE,
  organizer_id UUID REFERENCES public.organizers ON DELETE CASCADE,
  score INTEGER NOT NULL,
  match_reasons TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  related_id TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can see and manage their own notifications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'notifications'
      AND policyname = 'Allow select own notifications'
  ) THEN
    CREATE POLICY "Allow select own notifications"
      ON public.notifications FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'notifications'
      AND policyname = 'Allow insert own notifications'
  ) THEN
    CREATE POLICY "Allow insert own notifications"
      ON public.notifications FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'notifications'
      AND policyname = 'Allow update own notifications'
  ) THEN
    CREATE POLICY "Allow update own notifications"
      ON public.notifications FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'notifications'
      AND policyname = 'Allow delete own notifications'
  ) THEN
    CREATE POLICY "Allow delete own notifications"
      ON public.notifications FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;
-- Contracts table
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES public.matches ON DELETE CASCADE,
  brand_id UUID REFERENCES public.brands ON DELETE CASCADE,
  organizer_id UUID REFERENCES public.organizers ON DELETE CASCADE,
  sponsorship_amount TEXT NOT NULL,
  sponsorship_type TEXT NOT NULL,
  deliverables TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  payment_terms TEXT NOT NULL,
  cancellation_policy TEXT NOT NULL,
  additional_terms TEXT,
  brand_approved BOOLEAN DEFAULT false,
  organizer_approved BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
-- Enable RLS
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Sponsorship products table
CREATE TABLE IF NOT EXISTS public.sponsorship_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES public.brands ON DELETE CASCADE,
  name TEXT NOT NULL,
  goals TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline')),
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.sponsorship_products ENABLE ROW LEVEL SECURITY;

-- Sponsorship offers table
CREATE TABLE IF NOT EXISTS public.sponsorship_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES public.brands ON DELETE CASCADE,
  selected_types TEXT[] NOT NULL DEFAULT '{}',
  product_details JSONB,
  discount_details JSONB,
  financial_details JSONB,
  other_details JSONB,
  custom_mix JSONB,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM pg_constraint
     WHERE conname = 'sponsorship_offers_brand_unique'
       AND conrelid = 'public.sponsorship_offers'::regclass
  ) THEN
    ALTER TABLE public.sponsorship_offers
      ADD CONSTRAINT sponsorship_offers_brand_unique UNIQUE (brand_id);
  END IF;
END $$;

ALTER TABLE public.sponsorship_offers ENABLE ROW LEVEL SECURITY;

-- Organizer sponsorship requests table
CREATE TABLE IF NOT EXISTS public.organizer_sponsorship_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID REFERENCES public.organizers ON DELETE CASCADE,
  selected_types TEXT[] NOT NULL DEFAULT '{}',
  product_details JSONB,
  discount_details JSONB,
  financial_details JSONB,
  allocation JSONB,
  other_details JSONB,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM pg_constraint
     WHERE conname = 'organizer_sponsorship_requests_organizer_unique'
       AND conrelid = 'public.organizer_sponsorship_requests'::regclass
  ) THEN
    ALTER TABLE public.organizer_sponsorship_requests
      ADD CONSTRAINT organizer_sponsorship_requests_organizer_unique UNIQUE (organizer_id);
  END IF;
END $$;

ALTER TABLE public.organizer_sponsorship_requests ENABLE ROW LEVEL SECURITY;
-- Community members table
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('brand', 'organizer')),
  name TEXT NOT NULL,
  logo_url TEXT,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  website TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  social_links TEXT,
  featured BOOLEAN DEFAULT false,
  date_registered TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
-- Enable RLS
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- Saved community members join table
CREATE TABLE IF NOT EXISTS public.community_saved_members (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  member_id UUID REFERENCES public.community_members ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (user_id, member_id)
);
ALTER TABLE public.community_saved_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to manage saved members" ON public.community_saved_members;
CREATE POLICY "Allow users to manage saved members"
  ON public.community_saved_members
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Saved profiles (brand/organizer favorites)
CREATE TABLE IF NOT EXISTS public.saved_profiles (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (user_id, profile_id)
);
ALTER TABLE public.saved_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to manage saved profiles" ON public.saved_profiles;
CREATE POLICY "Allow users to manage saved profiles"
  ON public.saved_profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Match preferences (saved/dismissed matches)
CREATE TABLE IF NOT EXISTS public.match_preferences (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('saved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (user_id, match_id)
);
ALTER TABLE public.match_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to manage match preferences" ON public.match_preferences;
CREATE POLICY "Allow users to manage match preferences"
  ON public.match_preferences
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES public.brands ON DELETE CASCADE,
  organizer_id UUID REFERENCES public.organizers ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('brand', 'organizer', 'ai')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Support Tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON public.support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON public.support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_email ON public.support_tickets(email);

-- Function to auto-create profile when new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'role', 'Brand'),
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.sync_profile_to_related()
RETURNS trigger AS $$
BEGIN
  -- Update organizer contact info
  UPDATE public.organizers
     SET contact_name = NEW.name,
         email = NEW.email
   WHERE user_id = NEW.id;

  -- Update brand contact info
  UPDATE public.brands
     SET contact_name = NEW.name,
         email = NEW.email
   WHERE user_id = NEW.id;

  -- Keep community directory metadata in sync
  UPDATE public.community_members
    SET email = NEW.email,
      logo_url = COALESCE(NEW.logo_url, logo_url),
      description = COALESCE(NEW.description, description)
  WHERE user_id = NEW.id;

  -- Ensure brand listings display their company name
  UPDATE public.community_members cm
    SET name = COALESCE(b.company_name, cm.name)
   FROM public.brands b
  WHERE cm.user_id = NEW.id
    AND cm.type = 'brand'
    AND b.user_id = NEW.id;

  -- Ensure organizer listings display their organizer name
  UPDATE public.community_members cm
    SET name = COALESCE(o.organizer_name, cm.name)
   FROM public.organizers o
  WHERE cm.user_id = NEW.id
    AND cm.type = 'organizer'
    AND o.user_id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'sync_profile_updates'
  ) THEN
    CREATE TRIGGER sync_profile_updates
      AFTER UPDATE OF name, email, logo_url, description ON public.profiles
      FOR EACH ROW
      WHEN (OLD IS DISTINCT FROM NEW)
      EXECUTE FUNCTION public.sync_profile_to_related();
  END IF;
END $$;

-- Create RLS policies
-- These are basic policies that you should customize based on your security needs
-- Profiles policy - users can read all profiles but only update their own
DROP POLICY IF EXISTS "Allow users to read all profiles" ON public.profiles;
CREATE POLICY "Allow users to read all profiles"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;
CREATE POLICY "Allow users to insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
CREATE POLICY "Allow users to update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Enriched profiles view for discovery surfaces
DROP VIEW IF EXISTS public.profile_overview;
CREATE VIEW public.profile_overview
WITH (security_invoker = true)
AS
WITH organizer_event_details AS (
  SELECT DISTINCT ON (e.organizer_id)
    e.organizer_id,
    e.event_type,
    e.audience_description,
    e.sponsorship_needs,
    e.financial_sponsorship_amount,
    e.offering_types
  FROM public.events e
  ORDER BY e.organizer_id, e.created_at DESC NULLS LAST
)
SELECT
  p.id,
  p.role,
  p.name,
  p.email,
  p.logo_url,
  p.description,
  p.created_at,
  p.updated_at,
  CASE
    WHEN p.role = 'Brand' THEN jsonb_build_object(
      'sponsorshipTypes', COALESCE(to_jsonb(b.sponsorship_type), '[]'::jsonb),
      'budgetRange', b.budget,
      'quantity', b.product_quantity,
      'eventTypes', '[]'::jsonb,
      'audienceTags', to_jsonb(
        CASE
          WHEN b.target_audience IS NULL OR b.target_audience = '' THEN ARRAY[]::text[]
          ELSE regexp_split_to_array(b.target_audience, '\\s*,\\s*')
        END
      ),
      'notes', b.marketing_goals
    )
    WHEN p.role = 'Organizer' THEN jsonb_build_object(
      'sponsorshipTypes', COALESCE(to_jsonb(od.offering_types), '[]'::jsonb),
      'budgetRange', od.financial_sponsorship_amount,
      'quantity', NULL,
      'eventTypes', to_jsonb(
        CASE
          WHEN od.event_type IS NULL THEN ARRAY[]::text[]
          ELSE ARRAY[od.event_type]
        END
      ),
      'audienceTags', to_jsonb(
        CASE
          WHEN od.audience_description IS NULL OR od.audience_description = '' THEN ARRAY[]::text[]
          ELSE regexp_split_to_array(od.audience_description, '\\s*,\\s*')
        END
      ),
      'notes', od.sponsorship_needs
    )
    ELSE NULL
  END AS what_they_seek
FROM public.profiles p
LEFT JOIN public.brands b ON b.user_id = p.id
LEFT JOIN public.organizers o ON o.user_id = p.id
LEFT JOIN organizer_event_details od ON od.organizer_id = o.id;

GRANT SELECT ON public.profile_overview TO anon, authenticated;

-- Brands policies
DROP POLICY IF EXISTS "Allow public to read all brands" ON public.brands;
CREATE POLICY "Allow public to read all brands"
  ON public.brands FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow brands to insert own data" ON public.brands;
CREATE POLICY "Allow brands to insert own data"
  ON public.brands FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow brands to update own data" ON public.brands;
CREATE POLICY "Allow brands to update own data"
  ON public.brands FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Organizers policies
DROP POLICY IF EXISTS "Users can insert their own organizer profile" ON public.organizers;
CREATE POLICY "Users can insert their own organizer profile"
  ON public.organizers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own organizer profile" ON public.organizers;
CREATE POLICY "Users can update their own organizer profile"
  ON public.organizers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own organizer profile" ON public.organizers;
CREATE POLICY "Users can view their own organizer profile"
  ON public.organizers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view organizer profiles" ON public.organizers;
CREATE POLICY "Anyone can view organizer profiles"
  ON public.organizers
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow public to view events" ON public.events;
CREATE POLICY "Allow public to view events"
  ON public.events
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow organizers to insert their events" ON public.events;
CREATE POLICY "Allow organizers to insert their events"
  ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizers
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Allow organizers to update their events" ON public.events;
CREATE POLICY "Allow organizers to update their events"
  ON public.events
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organizers
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizers
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Allow organizers to delete their events" ON public.events;
CREATE POLICY "Allow organizers to delete their events"
  ON public.events
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organizers
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  );

-- Matches policies
DROP POLICY IF EXISTS "Allow participants to view their matches" ON public.matches;
CREATE POLICY "Allow participants to view their matches"
  ON public.matches FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.brands WHERE id = brand_id
      UNION
      SELECT user_id FROM public.organizers WHERE id = organizer_id
    )
  );

-- Contracts policies
DROP POLICY IF EXISTS "Allow users to read their contracts" ON public.contracts;
CREATE POLICY "Allow users to read their contracts"
  ON public.contracts FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.brands WHERE id = brand_id
      UNION
      SELECT user_id FROM public.organizers WHERE id = organizer_id
    )
  );

-- Sponsorship products policies
DROP POLICY IF EXISTS "Allow public to view sponsorship products" ON public.sponsorship_products;
CREATE POLICY "Allow public to view sponsorship products"
  ON public.sponsorship_products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow brands to insert sponsorship products" ON public.sponsorship_products;
CREATE POLICY "Allow brands to insert sponsorship products"
  ON public.sponsorship_products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.brands
    )
  );

DROP POLICY IF EXISTS "Allow brands to view own sponsorship products" ON public.sponsorship_products;
CREATE POLICY "Allow brands to view own sponsorship products"
  ON public.sponsorship_products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.brands
      WHERE id = brand_id AND user_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS "Allow brands to update sponsorship products" ON public.sponsorship_products;
CREATE POLICY "Allow brands to update sponsorship products"
  ON public.sponsorship_products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.brands
      WHERE id = brand_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.brands
      WHERE id = brand_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Allow brands to delete sponsorship products" ON public.sponsorship_products;
CREATE POLICY "Allow brands to delete sponsorship products"
  ON public.sponsorship_products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.brands
      WHERE id = brand_id AND user_id = auth.uid()
    )
  );

-- Sponsorship offers policies
DROP POLICY IF EXISTS "Allow public to view sponsorship offers" ON public.sponsorship_offers;
CREATE POLICY "Allow public to view sponsorship offers"
  ON public.sponsorship_offers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow brands to insert sponsorship offers" ON public.sponsorship_offers;
CREATE POLICY "Allow brands to insert sponsorship offers"
  ON public.sponsorship_offers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.brands
    )
  );
DROP POLICY IF EXISTS "Allow brands to view own sponsorship offers" ON public.sponsorship_offers;
CREATE POLICY "Allow brands to view own sponsorship offers"
  ON public.sponsorship_offers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.brands
      WHERE id = brand_id AND user_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS "Allow brands to update sponsorship offers" ON public.sponsorship_offers;
CREATE POLICY "Allow brands to update sponsorship offers"
  ON public.sponsorship_offers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.brands
      WHERE id = brand_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.brands
      WHERE id = brand_id AND user_id = auth.uid()
    )
  );

-- Organizer sponsorship requests policies
DROP POLICY IF EXISTS "Allow public to view organizer requests" ON public.organizer_sponsorship_requests;
CREATE POLICY "Allow public to view organizer requests"
  ON public.organizer_sponsorship_requests FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow organizers to insert sponsorship requests" ON public.organizer_sponsorship_requests;
CREATE POLICY "Allow organizers to insert sponsorship requests"
  ON public.organizer_sponsorship_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizers
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Allow organizers to view own sponsorship requests" ON public.organizer_sponsorship_requests;
CREATE POLICY "Allow organizers to view own sponsorship requests"
  ON public.organizer_sponsorship_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organizers
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Allow organizers to update sponsorship requests" ON public.organizer_sponsorship_requests;
CREATE POLICY "Allow organizers to update sponsorship requests"
  ON public.organizer_sponsorship_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organizers
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizers
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  );

-- Community members policies
DROP POLICY IF EXISTS "Allow users to read community members" ON public.community_members;
CREATE POLICY "Allow users to read community members"
  ON public.community_members FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow users to insert own community profile" ON public.community_members;
CREATE POLICY "Allow users to insert own community profile"
  ON public.community_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Conversations policies
DROP POLICY IF EXISTS "Allow users to read their conversations" ON public.conversations;
CREATE POLICY "Allow users to read their conversations"
  ON public.conversations FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.brands WHERE id = brand_id
      UNION
      SELECT user_id FROM public.organizers WHERE id = organizer_id
    )
  );

DROP POLICY IF EXISTS "Allow users to start conversations" ON public.conversations;
CREATE POLICY "Allow users to start conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (
    brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid())
    OR organizer_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid())
  );

-- Messages policies
DROP POLICY IF EXISTS "Allow users to read their messages" ON public.messages;
CREATE POLICY "Allow users to read their messages"
  ON public.messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid())
         OR organizer_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Allow users to insert messages in their conversations" ON public.messages;
CREATE POLICY "Allow users to insert messages in their conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid())
         OR organizer_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid())
    )
  );

-- Support tickets policies
DROP POLICY IF EXISTS "Allow admins to view all support tickets" ON public.support_tickets;
CREATE POLICY "Allow admins to view all support tickets"
  ON public.support_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

DROP POLICY IF EXISTS "Allow anyone to create support tickets" ON public.support_tickets;
CREATE POLICY "Allow anyone to create support tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admins to update support tickets" ON public.support_tickets;
CREATE POLICY "Allow admins to update support tickets"
  ON public.support_tickets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

DROP POLICY IF EXISTS "Allow admins to delete support tickets" ON public.support_tickets;
CREATE POLICY "Allow admins to delete support tickets"
  ON public.support_tickets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );