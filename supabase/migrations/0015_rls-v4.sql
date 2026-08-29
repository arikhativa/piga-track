-- ============================================================
-- RLS for transaction_category
-- ============================================================

ALTER TABLE public.transaction_category ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select currencies"
ON public.transaction_category
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert currencies"
ON public.transaction_category
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update currencies"
ON public.transaction_category
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete currencies"
ON public.transaction_category
FOR DELETE
TO authenticated
USING (true);


-- ============================================================
-- Grant transaction_category access
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.transaction_category
TO authenticated;