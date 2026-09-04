-- ============================================================
-- RLS for exchange_rate
-- ============================================================

ALTER TABLE public.exchange_rate ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select exchange rates"
ON public.exchange_rate
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert exchange rates"
ON public.exchange_rate
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update exchange rates"
ON public.exchange_rate
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete exchange rates"
ON public.exchange_rate
FOR DELETE
TO authenticated
USING (true);


-- ============================================================
-- Grant exchange_rate access
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.exchange_rate
TO authenticated;