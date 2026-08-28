ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON "profile"
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON "profile"
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);