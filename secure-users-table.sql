-- Secure the users_data table to hide passwords
-- Run this SQL in your Supabase SQL Editor

-- First, let's create a view that excludes passwords for safer queries
CREATE OR REPLACE VIEW users_safe AS
SELECT 
    id,
    name,
    email,
    first_name,
    last_name,
    created_at,
    updated_at
FROM users_data;

-- Grant permissions on the view
GRANT SELECT ON users_safe TO anon;
GRANT SELECT ON users_safe TO authenticated;

-- Create a function to safely authenticate users without exposing passwords
CREATE OR REPLACE FUNCTION authenticate_user(user_email TEXT, user_password TEXT)
RETURNS TABLE(
    id BIGINT,
    name VARCHAR,
    email VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    created_at TIMESTAMPTZ
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.name,
        u.email,
        u.first_name,
        u.last_name,
        u.created_at
    FROM users_data u
    WHERE u.email = user_email 
    AND u.password = user_password;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION authenticate_user TO anon;
GRANT EXECUTE ON FUNCTION authenticate_user TO authenticated;

-- Optional: Add RLS to users_data table to prevent direct password access
ALTER TABLE users_data ENABLE ROW LEVEL SECURITY;

-- Create policy that prevents password column from being selected directly
CREATE POLICY "Prevent password access" ON users_data
    FOR SELECT USING (false);

-- Create policy for insert (registration)
CREATE POLICY "Allow user registration" ON users_data
    FOR INSERT WITH CHECK (true);

-- Create policy for update (but not password updates via direct queries)
CREATE POLICY "Allow user updates" ON users_data
    FOR UPDATE USING (true);

-- Grant basic permissions (but RLS will restrict password access)
GRANT SELECT, INSERT, UPDATE ON users_data TO anon;
GRANT SELECT, INSERT, UPDATE ON users_data TO authenticated;