import { z } from "zod";

const email = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((value) => value.toLowerCase());

const password = z.string().min(8).max(128);

export const registerSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).max(20),
      email,
      password,
    })
    .strict(),
});

export const loginSchema = z.object({
  body: z
    .object({
      email,
      password,
    })
    .strict(),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: password,
      newPassword: password,
    })
    .strict()
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: "New password must differ from current password1",
      path: ["newPassword"],
    }),
});
