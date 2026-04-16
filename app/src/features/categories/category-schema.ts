import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(80, { message: "Name must be 80 characters or fewer." }),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
