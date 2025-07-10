import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const createUserSystemLinkSchema = z.object({
    user: z
        .string({ required_error: "El usuario es requerido" })
        .trim()
        .refine(isValidObjectId, { message: "Usuario inválido" }),
    system: z
        .string({ required_error: "El sistema es requerido" })
        .trim()
        .refine(isValidObjectId, { message: "Sistema inválido" }),
    isActive: z
        .boolean()
        .default(true)
        .optional(),
});

export const updateUserSystemLinkSchema = z.object({
    user: z
        .string()
        .trim()
        .refine(isValidObjectId, { message: "Usuario inválido" })
        .optional(),
    system: z
        .string()
        .trim()
        .refine(isValidObjectId, { message: "Sistema inválido" })
        .optional(),
    isActive: z
        .boolean()
        .default(true)
        .optional(),
});