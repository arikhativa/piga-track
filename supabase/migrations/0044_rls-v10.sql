-- ============================================================
-- RLS for auto_sync_conf
-- ============================================================

ALTER TABLE public.auto_sync_conf ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select auto_sync_conf"
ON public.auto_sync_conf
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update auto_sync_conf"
ON public.auto_sync_conf
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Remove default table grants before granting column-level updates.
-- Source identifiers and Vault references are managed by migrations or
-- restricted server-side operations, not application users.
REVOKE ALL PRIVILEGES
ON TABLE public.auto_sync_conf
FROM PUBLIC, anon, authenticated;

GRANT SELECT
ON TABLE public.auto_sync_conf
TO authenticated;

GRANT UPDATE (src_label, lookback_days, public_config, is_enabled, transaction_type_id)
ON TABLE public.auto_sync_conf
TO authenticated;

-- ============================================================
-- RLS for max_sync_table
-- ============================================================

ALTER TABLE public.max_sync_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select max_sync_table"
ON public.max_sync_table
FOR SELECT
TO authenticated
USING (true);

-- Raw source data is read-only for application users. Scraper writes
-- require a trusted server-side role that bypasses RLS.
REVOKE ALL PRIVILEGES
ON TABLE public.max_sync_table
FROM PUBLIC, anon, authenticated;

GRANT SELECT
ON TABLE public.max_sync_table
TO authenticated;
