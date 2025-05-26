import { z } from "zod";

export const paginationSchema = z.object({
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 1))
        .refine((val) => val > 0, { message: "El valor de page debe ser mayor a 0" }),
    limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 20))
        .refine((val) => val > 0, { message: 'El valor de limit debe ser mayor a 0' })
})