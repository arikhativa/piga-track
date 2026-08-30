CREATE POLICY "Authenticated users can view profiles"
ON "profile"
FOR SELECT
TO authenticated
USING (true);