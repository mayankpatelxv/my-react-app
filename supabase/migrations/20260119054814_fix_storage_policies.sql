-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload purchase documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own purchase documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own purchase documents" ON storage.objects;

-- Create new policies that work with anonymous users (since you're using custom auth)
CREATE POLICY "Allow anonymous upload to purchase documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'purchase-documents'
);

CREATE POLICY "Allow anonymous view of purchase documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'purchase-documents'
);

CREATE POLICY "Allow anonymous delete of purchase documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'purchase-documents'
);

-- Also allow updates for completeness
CREATE POLICY "Allow anonymous update of purchase documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'purchase-documents'
) WITH CHECK (
  bucket_id = 'purchase-documents'
);