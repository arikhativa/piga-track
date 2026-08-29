
-- ============================================================
-- RLS for transaction_type
-- ============================================================

ALTER TABLE public.transaction_type ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select currencies"
ON public.transaction_type
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert currencies"
ON public.transaction_type
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update currencies"
ON public.transaction_type
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete currencies"
ON public.transaction_type
FOR DELETE
TO authenticated
USING (true);


-- ============================================================
-- Grant transaction_type access
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.transaction_type
TO authenticated;