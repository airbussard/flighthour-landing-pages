-- Supabase Storage Setup für Experience Images
-- Führe dies in der Supabase SQL Editor aus

-- 1. Erstelle einen Storage Bucket für Experience Images (falls noch nicht vorhanden)
-- Dies muss über die Supabase Dashboard UI gemacht werden:
-- Storage → New Bucket → Name: "experience-images" → Public: Yes

-- 2. Storage Policies für den Bucket

-- Erlaube öffentliches Lesen aller Bilder
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'experience-images');

-- Erlaube authentifizierten Admins das Hochladen
CREATE POLICY "Admin Upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'experience-images'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'ADMIN'
  )
);

-- Erlaube authentifizierten Admins das Löschen
CREATE POLICY "Admin Delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'experience-images'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'ADMIN'
  )
);

-- 3. Migration bestehender Bildpfade (optional)
-- Dies migriert existierende Einträge von lokalen Pfaden zu Supabase URLs
-- ACHTUNG: Passe die Supabase URL an deine Projekt-ID an!

/*
UPDATE experience_images
SET filename = REPLACE(
  filename,
  '/api/images/uploads/experiences/',
  'https://chmbntoufwhhqlnbapdw.supabase.co/storage/v1/object/public/experience-images/'
)
WHERE filename LIKE '/api/images/%';
*/

-- Hinweis: Die tatsächliche Migration der Bilder muss manuell erfolgen:
-- 1. Lade die Bilder vom Server herunter
-- 2. Lade sie in den Supabase Storage Bucket hoch
-- 3. Führe das UPDATE Statement aus