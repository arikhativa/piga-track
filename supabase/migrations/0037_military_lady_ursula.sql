-- ============================================================
-- RLS for transaction_classification_rule
-- ============================================================

ALTER TABLE public.transaction_classification_rule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select transaction_classification_rule"
ON public.transaction_classification_rule
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert transaction_classification_rule"
ON public.transaction_classification_rule
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update transaction_classification_rule"
ON public.transaction_classification_rule
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete transaction_classification_rule"
ON public.transaction_classification_rule
FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- Grant transaction_classification_rule access
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.transaction_classification_rule
TO authenticated;
