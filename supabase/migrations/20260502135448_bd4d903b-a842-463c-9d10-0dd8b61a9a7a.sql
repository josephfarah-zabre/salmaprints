INSERT INTO public.user_roles (user_id, role)
SELECT 'c15e72e6-890b-4a5c-998e-73db4b0890f2', 'admin'::app_role
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = 'c15e72e6-890b-4a5c-998e-73db4b0890f2' AND role = 'admin'
);