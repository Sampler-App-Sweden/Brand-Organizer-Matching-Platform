-- Fix RLS policies to allow public read access to brands and organizers

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow users to read all brands" ON public.brands;
DROP POLICY IF EXISTS "Allow users to read all organizers" ON public.organizers;

-- Create new policies that allow anyone to read brands and organizers
CREATE POLICY "Allow public to read all brands"
  ON public.brands FOR SELECT
  USING (true);

CREATE POLICY "Allow public to read all organizers"
  ON public.organizers FOR SELECT
  USING (true);

-- Keep the insert/update policies restricted to owners
-- (these should already exist from the schema)
