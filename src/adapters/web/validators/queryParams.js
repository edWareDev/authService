import { z } from "zod";

const PAGINATION_CONFIG = {
    PAGE_DEFAULT_VALUE: 1,
    LIMIT_DEFAULT_VALUE: 20
};

export const paginationSchema = z.object({
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : PAGINATION_CONFIG.PAGE_DEFAULT_VALUE))
        .refine((val) => val > 0, { message: "El valor de page debe ser mayor a 0" }),
    limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : PAGINATION_CONFIG.LIMIT_DEFAULT_VALUE))
        .refine((val) => val > 0, { message: 'El valor de limit debe ser mayor a 0' })
});