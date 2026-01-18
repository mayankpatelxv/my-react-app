-- Simple approach: Just update existing passwords to be hashed
-- Run this SQL in your Supabase SQL Editor

-- First, let's hash existing passwords (Base64 encoding for simplicity)
-- WARNING: This will update all existing passwords
-- Users will need to register again or you'll need to inform them

-- Option 1: Hash existing passwords (this will break existing logins)
-- UPDATE users_data SET password = encode(password::bytea, 'base64');

-- Option 2: Create a backup and clear passwords (safer approach)
-- Create backup table first
CREATE TABLE users_data_backup AS SELECT * FROM users_data;

-- Clear existing passwords (users will need to register again)
-- UPDATE users_data SET password = 'RESET_REQUIRED';

-- Option 3: Just add a comment for manual handling
-- You can manually update passwords or ask users to re-register

-- Add a note column to track password security
ALTER TABLE users_data ADD COLUMN IF NOT EXISTS password_hashed BOOLEAN DEFAULT FALSE;

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users_data(email);

-- Optional: Create a view without passwords for admin queries
CREATE OR REPLACE VIEW users_admin_view AS
SELECT 
    id,
    name,
    email,
    first_name,
    last_name,
    password_hashed,
    created_at,
    updated_at
FROM users_data;

GRANT SELECT ON users_admin_view TO authenticated;