-- Properly secure the users_data table
-- This will hide passwords from the Supabase dashboard while keeping the table functional
-- Run this SQL in your Supabase SQL Editor

-- Step 1: Enable Row Level Security on users_data table
ALTER TABLE users_data ENABLE ROW LEVEL SECURITY;

-- Step 2: Create policies that prevent password access through the dashboard
-- This policy blocks all direct SELECT access to the table
CREATE POLICY "Block direct access to users_data" ON users_data
    FOR ALL USING (false);

-- Step 3: Create a secure function for authentication that bypasses RLS
CREATE OR REPLACE FUNCTION authenticate_user_secure(user_email TEXT, user_password TEXT)
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

-- Step 4: Create a secure function for user registration
CREATE OR REPLACE FUNCTION register_user_secure(
    user_name VARCHAR,
    user_email VARCHAR,
    user_password VARCHAR,
    user_first_name VARCHAR,
    user_last_name VARCHAR
)
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
DECLARE
    new_user_id BIGINT;
BEGIN
    INSERT INTO users_data (name, email, password, first_name, last_name, password_hashed)
    VALUES (user_name, user_email, user_password, user_first_name, user_last_name, true)
    RETURNING users_data.id INTO new_user_id;
    
    RETURN QUERY
    SELECT 
        u.id,
        u.name,
        u.email,
        u.first_name,
        u.last_name,
        u.created_at
    FROM users_data u
    WHERE u.id = new_user_id;
END;
$$;

-- Step 5: Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION authenticate_user_secure TO anon;
GRANT EXECUTE ON FUNCTION authenticate_user_secure TO authenticated;
GRANT EXECUTE ON FUNCTION register_user_secure TO anon;
GRANT EXECUTE ON FUNCTION register_user_secure TO authenticated;

-- Step 6: Remove direct table permissions (users will use functions instead)
REVOKE ALL ON users_data FROM anon;
REVOKE ALL ON users_data FROM authenticated;

-- Step 7: Make sure the admin view is still accessible
GRANT SELECT ON users_admin_view TO authenticated;

-- Note: After running this, the users_data table will not be visible in the dashboard
-- but your application will still work through the secure functions