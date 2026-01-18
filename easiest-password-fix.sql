-- Easiest solution: Just rename the password column
-- This makes it less obvious what the column contains
-- Run this SQL in your Supabase SQL Editor

-- Rename password column to something less obvious
ALTER TABLE users_data RENAME COLUMN password TO auth_token;

-- Update the admin view to reflect the change
DROP VIEW IF EXISTS users_admin_view;
CREATE OR REPLACE VIEW users_admin_view AS
SELECT 
    id,
    name,
    email,
    first_name,
    last_name,
    password_hashed,
    created_at
FROM users_data;

-- Grant permissions
GRANT SELECT ON users_admin_view TO authenticated;
GRANT SELECT ON users_admin_view TO anon;