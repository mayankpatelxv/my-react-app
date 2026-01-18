-- Fix users table security (works with existing table structure)
-- Run this SQL in your Supabase SQL Editor

-- First, let's check what columns exist and add missing ones
-- Add password_hashed column if it doesn't exist
ALTER TABLE users_data ADD COLUMN IF NOT EXISTS password_hashed BOOLEAN DEFAULT FALSE;

-- Add updated_at column if it doesn't exist (optional)
ALTER TABLE users_data ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create updated_at trigger if we added the column
CREATE OR REPLACE FUNCTION update_users_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_users_data_updated_at ON users_data;
CREATE TRIGGER update_users_data_updated_at 
    BEFORE UPDATE ON users_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_users_updated_at_column();

-- Create admin view that works with existing columns
CREATE OR REPLACE VIEW users_admin_view AS
SELECT 
    id,
    name,
    email,
    first_name,
    last_name,
    password_hashed,
    created_at,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users_data' 
            AND column_name = 'updated_at'
        ) THEN updated_at
        ELSE created_at
    END as updated_at
FROM users_data;

-- Grant permissions on the view
GRANT SELECT ON users_admin_view TO authenticated;
GRANT SELECT ON users_admin_view TO anon;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_data_email ON users_data(email);