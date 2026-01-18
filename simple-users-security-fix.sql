-- Simple fix for users table security
-- Run this SQL in your Supabase SQL Editor

-- Add password_hashed column
ALTER TABLE users_data ADD COLUMN IF NOT EXISTS password_hashed BOOLEAN DEFAULT FALSE;

-- Create simple admin view without passwords (using only existing columns)
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

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_data_email ON users_data(email);

-- Optional: Create a backup of current data before any changes
-- CREATE TABLE users_data_backup AS SELECT * FROM users_data;