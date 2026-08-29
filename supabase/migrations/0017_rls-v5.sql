-- ============================================================
-- RLS for transaction_project
-- ============================================================

ALTER TABLE public.transaction_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select currencies"
ON public.transaction_project
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert currencies"
ON public.transaction_project
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update currencies"
ON public.transaction_project
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete currencies"
ON public.transaction_project
FOR DELETE
TO authenticated
USING (true);


-- ============================================================
-- Grant transaction_project access
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.transaction_project
TO authenticated;