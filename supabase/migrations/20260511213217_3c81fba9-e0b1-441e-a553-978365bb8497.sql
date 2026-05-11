CREATE TABLE public.hero_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  subtitle_en TEXT,
  subtitle_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active hero slides" ON public.hero_slides
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all hero slides" ON public.hero_slides
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert hero slides" ON public.hero_slides
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update hero slides" ON public.hero_slides
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete hero slides" ON public.hero_slides
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_hero_slides_updated_at
  BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.hero_slides (title_en, title_ar, subtitle_en, subtitle_ar, display_order) VALUES
  ('Print Your Dreams', 'اطبع أحلامك', 'Delivered in 2 days', 'تسليم خلال يومين', 0),
  ('Custom Gifts', 'هدايا مخصصة', 'For every occasion', 'لكل المناسبات', 1),
  ('Pro Design', 'تصاميم احترافية', 'Creative team', 'فريق إبداعي', 2);

INSERT INTO storage.buckets (id, name, public) VALUES ('hero-slides', 'hero-slides', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Hero slide images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'hero-slides');

CREATE POLICY "Admins can upload hero slide images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'hero-slides' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update hero slide images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'hero-slides' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete hero slide images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'hero-slides' AND has_role(auth.uid(), 'admin'::app_role));