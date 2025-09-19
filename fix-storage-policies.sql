-- Fix Storage Policies - Drop and Recreate with proper type casting
-- Führe diese Befehle in der Supabase SQL Editor aus

-- 1. Drop existing policies (if they exist)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;

-- 2. Recreate policies with proper type casting

-- Erlaube öffentliches Lesen aller Bilder
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'experience-images');

-- Erlaube authentifizierten Admins das Hochladen
-- WICHTIG: auth.uid()::text für korrekte Typkonvertierung
CREATE POLICY "Admin Upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'experience-images'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()::text  -- Cast UUID to TEXT
    AND role = 'ADMIN'
  )
);

-- Erlaube authentifizierten Admins das Löschen
-- WICHTIG: auth.uid()::text für korrekte Typkonvertierung
CREATE POLICY "Admin Delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'experience-images'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()::text  -- Cast UUID to TEXT
    AND role = 'ADMIN'
  )
);

-- 3. Verify the policies were created successfully
SELECT * FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname IN ('Public Access', 'Admin Upload', 'Admin Delete');