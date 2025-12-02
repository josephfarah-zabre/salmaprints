-- Create promotional_popups table
CREATE TABLE public.promotional_popups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promotional_popups ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active popups"
ON public.promotional_popups
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can insert popups"
ON public.promotional_popups
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update popups"
ON public.promotional_popups
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete popups"
ON public.promotional_popups
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_promotional_popups_updated_at
BEFORE UPDATE ON public.promotional_popups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for popup images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('popup-images', 'popup-images', true);

-- Storage RLS Policies
CREATE POLICY "Anyone can view popup images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'popup-images');

CREATE POLICY "Admins can upload popup images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'popup-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update popup images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'popup-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete popup images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'popup-images' AND has_role(auth.uid(), 'admin'::app_role));