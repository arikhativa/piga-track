-- ============================================================
-- Row Level Security
-- ============================================================

-- PROFILE
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON "profile"
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can create their own profile"
ON "profile"
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON "profile"
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can delete their own profile"
ON "profile"
FOR DELETE
TO authenticated
USING (id = auth.uid());

-- TRANSACTION TAG
ALTER TABLE "transaction_tag" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select transaction tags"
ON "transaction_tag"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert transaction tags"
ON "transaction_tag"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update transaction tags"
ON "transaction_tag"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete transaction tags"
ON "transaction_tag"
FOR DELETE
TO authenticated
USING (true);


-- TRANSACTION
ALTER TABLE "transaction" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select transactions"
ON "transaction"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert transactions"
ON "transaction"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update transactions"
ON "transaction"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete transactions"
ON "transaction"
FOR DELETE
TO authenticated
USING (true);