-- Setup Supabase Storage for Product Images
-- Run this in your Supabase SQL Editor to enable image storage

-- Create the product-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create a simple policy that allows all operations on product-images bucket
-- This bypasses RLS issues by allowing all authenticated users full access
DO $$
BEGIN
  -- Only create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow all operations on product-images'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow all operations on product-images" ON storage.objects FOR ALL USING (bucket_id = ''product-images'')';
  END IF;
END $$;

-- Verification queries:
-- SELECT * FROM storage.buckets WHERE id = 'product-images';
-- SELECT * FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE '%product-images%';