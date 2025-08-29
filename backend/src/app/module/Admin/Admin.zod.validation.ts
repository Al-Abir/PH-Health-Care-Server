import { z } from "zod";

export const updateAdminScheam = z.object({
  name: z.string().optional(),
  portfolio_image: z.string().optional(),
  contact_number: z.string().optional(),
});
