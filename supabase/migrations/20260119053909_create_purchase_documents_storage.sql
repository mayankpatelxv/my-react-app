-- Create storage bucket for purchase documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'purchase-documents',
  'purchase-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/webp']
);

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Users can upload purchase documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'purchase-documents' AND
  auth.role() = 'authenticated'
);

-- Create policy to allow users to view their own files
CREATE POLICY "Users can view their own purchase documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'purchase-documents' AND
  auth.role() = 'authenticated'
);

-- Create policy to allow users to delete their own files
CREATE POLICY "Users can delete their own purchase documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'purchase-documents' AND
  auth.role() = 'authenticated'
);