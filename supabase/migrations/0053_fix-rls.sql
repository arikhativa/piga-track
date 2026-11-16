-- Keep shared profile reads; the own-profile SELECT policy is redundant.
DROP POLICY "Users can view their own profile" ON public.profile;
--> statement-breakpoint
ALTER POLICY "Users can create their own profile"
ON public.profile
WITH CHECK (id = (SELECT auth.uid()));
--> statement-breakpoint
ALTER POLICY "Users can update their own profile"
ON public.profile
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));
--> statement-breakpoint
ALTER POLICY "Users can delete their own profile"
ON public.profile
USING (id = (SELECT auth.uid()));
