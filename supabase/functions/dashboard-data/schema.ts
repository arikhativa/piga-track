import { z } from "zod";

export const dashboardRequestSchema = z.object({
  from: z.iso.datetime(),
  to: z.iso.datetime(),
});

// NOTE - this is copied to the front end
type DashboardRequest = z.infer<typeof dashboardRequestSchema>;
