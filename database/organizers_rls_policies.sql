-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own organizer profile" ON organizers;
DROP POLICY IF EXISTS "Users can update their own organizer profile" ON organizers;
DROP POLICY IF EXISTS "Users can view their own organizer profile" ON organizers;

-- Create proper policies for organizers table
CREATE POLICY "Users can insert their own organizer profile"
ON organizers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own organizer profile"
ON organizers
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own organizer profile"
ON organizers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view organizer profiles"
ON organizers
FOR SELECT
TO public
USING (true);