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
-- Create RLS policies
-- These are basic policies that you should customize based on your security needs
-- Profiles policy - users can read all profiles but only update their own
CREATE POLICY "Allow users to read all profiles"
  ON public.profiles FOR SELECT
  USING (true);
CREATE POLICY "Allow users to update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
-- Similar policies for other tables
-- (Add more specific policies based on your app's security requirements)