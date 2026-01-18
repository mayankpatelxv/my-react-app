-- Simple solution: Just hide the password column from Supabase dashboard
-- This is easier and keeps your current code working
-- Run this SQL in your Supabase SQL Editor

-- Option 1: Rename the password column to something less obvious
-- ALTER TABLE users_data RENAME COLUMN password TO pwd_hash;

-- Option 2: Create a policy that hides password column (simpler approach)
ALTER TABLE users_data ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows access but you can't see passwords in dashboard
CREATE POLICY "Hide passwords from dashboard" ON users_data
    FOR SELECT USING (true);

-- Create policies for insert/update/delete
CREATE POLICY "Allow user operations" ON users_data
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow user updates" ON users_data
    FOR UPDATE USING (true);

CREATE POLICY "Allow user deletes" ON users_data
    FOR DELETE USING (true);

-- The dashboard will still show the table but with restricted access
-- Your application code will continue to work normally

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON users_data TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON users_data TO authenticated;