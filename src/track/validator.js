import { z } from "zod";

const trackFields = z.object({
  type: z.enum(["Income", "Expense"]),
  amount: z.number().int().positive(),
  reason: z.string().trim().min(1).max(200),
});

export const createTrackSchema = z.object({
  body: trackFields.strict(),
});

export const updateTrackSchema = z.object({
  body: trackFields
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
});

export const idParamSchema = z.object({
  params: z
    .object({
      id: z.coerce.number().int().positive(),
    })
    .strict(),
});
