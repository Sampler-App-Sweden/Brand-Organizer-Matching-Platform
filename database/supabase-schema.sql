-- Users table (extending Supabase Auth)
CREATE TABLE public.profiles (
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
CREATE TABLE public.brands (
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
CREATE TABLE public.organizers (
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
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  elevator_pitch TEXT,
  event_frequency TEXT,
  event_date DATE NOT NULL,
  location TEXT NOT NULL,
  attendee_count TEXT NOT NULL,
  audience_description TEXT NOT NULL,
  audience_demographics TEXT[],
  sponsorship_needs TEXT NOT NULL,
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
-- Enable RLS
ALTER TABLE public.organizers ENABLE ROW LEVEL SECURITY;
-- Matches table
CREATE TABLE public.matches (
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
-- Contracts table
CREATE TABLE public.contracts (
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
CREATE TABLE public.sponsorship_products (
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
CREATE TABLE public.sponsorship_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES public.brands ON DELETE CASCADE,
  selected_types TEXT[] NOT NULL DEFAULT '{}',
  product_details JSONB,
  discount_details JSONB,
  financial_details JSONB,
  custom_mix JSONB,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.sponsorship_offers
  ADD CONSTRAINT sponsorship_offers_brand_unique UNIQUE (brand_id);

ALTER TABLE public.sponsorship_offers ENABLE ROW LEVEL SECURITY;
-- Community members table
CREATE TABLE public.community_members (
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
-- Conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES public.brands ON DELETE CASCADE,
  organizer_id UUID REFERENCES public.organizers ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('brand', 'organizer', 'ai')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
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

-- Trigger on auth.users to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create RLS policies
-- These are basic policies that you should customize based on your security needs
-- Profiles policy - users can read all profiles but only update their own
CREATE POLICY "Allow users to read all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow users to insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Brands policies
CREATE POLICY "Allow public to read all brands"
  ON public.brands FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow brands to insert own data"
  ON public.brands FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow brands to update own data"
  ON public.brands FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Organizers policies
CREATE POLICY "Users can insert their own organizer profile"
  ON public.organizers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own organizer profile"
  ON public.organizers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own organizer profile"
  ON public.organizers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view organizer profiles"
  ON public.organizers
  FOR SELECT
  TO public
  USING (true);

-- Matches policies
    auth.uid() IN (
      SELECT user_id FROM public.brands WHERE id = brand_id
      UNION
      SELECT user_id FROM public.organizers WHERE id = organizer_id
    )
  );

-- Contracts policies
CREATE POLICY "Allow users to read their contracts"
  ON public.contracts FOR SELECT
  USING (
    auth.uid() IN (
      UNION
      SELECT user_id FROM public.organizers WHERE id = organizer_id
    )
  );

-- Sponsorship products policies
CREATE POLICY "Allow public to view sponsorship products"
  ON public.sponsorship_products FOR SELECT
  USING (true);

CREATE POLICY "Allow brands to insert sponsorship products"
  ON public.sponsorship_products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.brands
CREATE POLICY "Allow brands to view own sponsorship products"
  ON public.sponsorship_products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.brands
      WHERE id = brand_id AND user_id = auth.uid()
    )
  );
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
CREATE POLICY "Allow public to view sponsorship offers"
  ON public.sponsorship_offers FOR SELECT
  USING (true);

CREATE POLICY "Allow brands to insert sponsorship offers"
  ON public.sponsorship_offers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.brands
CREATE POLICY "Allow brands to view own sponsorship offers"
  ON public.sponsorship_offers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.brands
      WHERE id = brand_id AND user_id = auth.uid()
    )
  );
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

-- Community members policies
CREATE POLICY "Allow users to read community members"
  ON public.community_members FOR SELECT
  USING (true);

CREATE POLICY "Allow users to insert own community profile"
  ON public.community_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Allow users to read their conversations"
  ON public.conversations FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.brands WHERE id = brand_id
      UNION
      SELECT user_id FROM public.organizers WHERE id = organizer_id
    )
  );

-- Messages policies
CREATE POLICY "Allow users to read their messages"
  ON public.messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid())
         OR organizer_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Allow users to insert messages in their conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid())
         OR organizer_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid())
    )
  );