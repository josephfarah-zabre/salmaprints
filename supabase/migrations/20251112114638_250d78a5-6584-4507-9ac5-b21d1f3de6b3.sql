-- Create storage bucket for category images
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- RLS policies for category-images bucket
CREATE POLICY "Public Access for category images"
ON storage.objects FOR SELECT
USING (bucket_id = 'category-images');

CREATE POLICY "Authenticated users can upload category images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'category-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update category images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'category-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete category images"
ON storage.objects FOR DELETE
USING (bucket_id = 'category-images' AND auth.role() = 'authenticated');

-- RLS policies for product-images bucket
CREATE POLICY "Public Access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');