-- ============================================================
-- RLS for import_profile
-- ============================================================

ALTER TABLE public.import_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select import_profile"
ON public.import_profile
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert import_profile"
ON public.import_profile
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update import_profile"
ON public.import_profile
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete import_profile"
ON public.import_profile
FOR DELETE
TO authenticated
USING (true);


-- ============================================================
-- Grant import_profile access
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.import_profile
TO authenticated;