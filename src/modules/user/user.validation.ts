import { z } from "zod";
type MySchemaType = z.ZodType<any>;

export const userRegistrationSchema = z.object({
  email: z.string().email(),
});

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
