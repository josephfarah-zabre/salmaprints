-- Drop existing policies that target the wrong role
DROP POLICY IF EXISTS "Admins can delete popups" ON public.promotional_popups;
DROP POLICY IF EXISTS "Admins can insert popups" ON public.promotional_popups;
DROP POLICY IF EXISTS "Admins can update popups" ON public.promotional_popups;
DROP POLICY IF EXISTS "Anyone can view active popups" ON public.promotional_popups;

-- Recreate with proper roles
CREATE POLICY "Admins can delete popups"
ON public.promotional_popups FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert popups"
ON public.promotional_popups FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update popups"
ON public.promotional_popups FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all popups (active or not) so they can manage them
CREATE POLICY "Admins can view all popups"
ON public.promotional_popups FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public can still view active popups
CREATE POLICY "Anyone can view active popups"
ON public.promotional_popups FOR SELECT
TO anon, authenticated
USING (is_active = true);