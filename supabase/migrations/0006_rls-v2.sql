
-- ============================================================
-- RLS for currency
-- ============================================================

ALTER TABLE public.currency ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select currencies"
ON public.currency
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert currencies"
ON public.currency
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update currencies"
ON public.currency
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete currencies"
ON public.currency
FOR DELETE
TO authenticated
USING (true);


-- ============================================================
-- Grant currency access
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.currency
TO authenticated;