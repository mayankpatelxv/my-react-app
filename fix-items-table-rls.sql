-- Fix RLS issue for items table
-- Run this SQL in your Supabase SQL Editor if you already created the table

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own items" ON items;
DROP POLICY IF EXISTS "Users can insert their own items" ON items;
DROP POLICY IF EXISTS "Users can update their own items" ON items;
DROP POLICY IF EXISTS "Users can delete their own items" ON items;

-- Disable Row Level Security
ALTER TABLE items DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anon and authenticated users
GRANT ALL ON items TO anon;
GRANT ALL ON items TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE items_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE items_id_seq TO authenticated;