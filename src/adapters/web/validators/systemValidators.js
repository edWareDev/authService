import { z } from 'zod';

export const createSystemSchema = z.object({
    name: z
        .string({ required_error: "El nombre es requerido" })
        .trim()
        .min(3, { message: "El nombre debería tener por lo menos 3 caracteres" })
        .max(50, { message: "El nombre no puede tener más de 50 caracteres" }),
    isActive: z
        .boolean()
        .optional()
});

export const updateSystemSchema = z.object({
    name: z
        .string()
        .transform(val => val?.trim())
        .refine(val => !val || val.length >= 3, { message: "El nombre debería tener por lo menos 3 caracteres" })
        .refine(val => !val || val.length <= 50, { message: "El nombre no puede tener más de 50 caracteres" })
        .optional(),
    isActive: z
        .boolean()
        .optional()
});