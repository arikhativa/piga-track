-- ============================================================
-- Grants for authenticated users
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE
    public.profile,
    public.transaction,
    public.transaction_tag
TO authenticated;

-- Required for serial columns
GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA public
TO authenticated;