-- Only the privileged migration role may modify transaction types.
REVOKE ALL PRIVILEGES ON TABLE public.transaction_type FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT ON TABLE public.transaction_type TO authenticated, service_role;
--> statement-breakpoint
DROP POLICY "Authenticated users can select currencies" ON public.transaction_type;
DROP POLICY "Authenticated users can insert currencies" ON public.transaction_type;
DROP POLICY "Authenticated users can update currencies" ON public.transaction_type;
DROP POLICY "Authenticated users can delete currencies" ON public.transaction_type;
ALTER TABLE public.transaction_type ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can select transaction types"
ON public.transaction_type
FOR SELECT
TO authenticated
USING (true);
--> statement-breakpoint
ALTER TABLE public.transaction_type DROP COLUMN base;
--> statement-breakpoint
INSERT INTO public.transaction_type (id, name) VALUES
	(1, 'Cash'),
	(2, 'Bit'),
	(3, 'Cal'),
	(4, 'Fibi'),
	(5, 'Paybox'),
	(6, 'Max')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
--> statement-breakpoint
-- Existing Credit Card transactions belong to Max; type 3 now represents Cal.
UPDATE public.transaction
SET transaction_type_id = 6
WHERE transaction_type_id = 3;
--> statement-breakpoint
-- Foreign keys intentionally reject deletion of any extra type still in use.
DELETE FROM public.transaction_type
WHERE id NOT IN (1, 2, 3, 4, 5, 6);
--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('public.transaction_type', 'id'), 6, true);
