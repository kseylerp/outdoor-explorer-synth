
-- Create a new bucket for storing activity images
INSERT INTO storage.buckets (id, name, public)
VALUES ('activities', 'activities', true);

-- Create policies to allow public read access to all files
CREATE POLICY "Public Access to Activities Images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'activities');

-- Allow users to upload files to the activities bucket
CREATE POLICY "Allow users to upload activity images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'activities');

-- Allow users to update their own activity images
CREATE POLICY "Allow users to update their own activity images"
ON storage.objects
FOR UPDATE 
TO authenticated
USING (bucket_id = 'activities' AND auth.uid() = owner);

-- Allow users to delete their own activity images
CREATE POLICY "Allow users to delete their own activity images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'activities' AND auth.uid() = owner);
