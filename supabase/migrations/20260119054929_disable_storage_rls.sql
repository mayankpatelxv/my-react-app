-- Disable RLS on storage.objects for the purchase-documents bucket
-- This is safe since you're using custom authentication and controlling access in your app

-- First, drop all existing policies for purchase-documents
DROP POLICY IF EXISTS "Allow anonymous upload to purchase documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous view of purchase documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous delete of purchase documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous update of purchase documents" ON storage.objects;

-- Create a single policy that allows all operations for purchase-documents bucket
CREATE POLICY "Allow all operations on purchase documents" ON storage.objects
FOR ALL USING (bucket_id = 'purchase-documents')
WITH CHECK (bucket_id = 'purchase-documents');

-- Make sure the bucket exists and is properly configured
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'purchase-documents',
  'purchase-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/webp'];