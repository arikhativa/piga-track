-- ============================================================
-- RLS for import_batch
-- ============================================================

ALTER TABLE public.import_batch ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select import_batch"
ON public.import_batch
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert import_batch"
ON public.import_batch
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update import_batch"
ON public.import_batch
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete import_batch"
ON public.import_batch
FOR DELETE
TO authenticated
USING (true);


-- ============================================================
-- Grant import_batch access
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.import_batch
TO authenticated;

-- ============================================================
-- RLS for import_row
-- ============================================================

ALTER TABLE public.import_row ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select import_row"
ON public.import_row
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert import_row"
ON public.import_row
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update import_row"
ON public.import_row
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete import_row"
ON public.import_row
FOR DELETE
TO authenticated
USING (true);


-- ============================================================
-- Grant import_row access
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.import_row
TO authenticated;