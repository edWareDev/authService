import { z } from 'zod';

const SYSTEM_CONFIG = {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 50
};

export const createSystemSchema = z.object({
    name: z
        .string({ required_error: "El nombre es requerido" })
        .trim()
        .min(SYSTEM_CONFIG.NAME_MIN_LENGTH, { message: `El nombre debería tener por lo menos ${SYSTEM_CONFIG.NAME_MIN_LENGTH} carácteres` })
        .max(SYSTEM_CONFIG.NAME_MAX_LENGTH, { message: `El nombre no puede tener más de ${SYSTEM_CONFIG.NAME_MAX_LENGTH} carácteres` }),
    isActive: z
        .boolean()
        .optional()
});

export const updateSystemSchema = z.object({
    name: z
        .string()
        .transform(val => val?.trim())
        .refine(val => !val || val.length >= SYSTEM_CONFIG.NAME_MIN_LENGTH, { message: `El nombre debería tener por lo menos ${SYSTEM_CONFIG.NAME_MIN_LENGTH} carácteres` })
        .refine(val => !val || val.length <= SYSTEM_CONFIG.NAME_MAX_LENGTH, { message: `El nombre no puede tener más de ${SYSTEM_CONFIG.NAME_MAX_LENGTH} carácteres` })
        .optional(),
    isActive: z
        .boolean()
        .optional()
});