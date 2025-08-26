import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const createUserCodeSchema = z.object({
    user: z
        .string({ required_error: "El usuario es requerido" })
        .trim()
        .refine(isValidObjectId, { message: "Usuario inválido" }),
    type: z
        .enum(["PASSWORD_RECOVERY", "EMAIL_VERIFICATION", "LOGIN"], { message: "El tipo ingresado no es válido" }),
    timesSent: z
        .number({ required_error: "El número de veces enviado es requerido" })
        .default(0),
    codeHasBeenUsed: z
        .boolean()
        .default(false),
    ipAddress: z
        .string({ required_error: "La dirección IP es requerida" })
        .default("unknown"),
    userAgent: z
        .string({ required_error: "El usuario agente es requerido" })
        .default("unknown"),
    expiredAt: z
        .date({ required_error: "La fecha de expiración es requerida" }),
});

export const updateUserCodeSchema = z.object({
    timesSent: z
        .number({ required_error: "El número de veces enviado es requerido" })
        .default(1)
        .optional(),
    codeHasBeenUsed: z
        .boolean()
        .default(false)
        .optional(),
    ipAddress: z
        .string({ required_error: "La dirección IP es requerida" })
        .regex(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, { message: "La dirección IP no es válida" })
        .optional(),
    userAgent: z
        .string({ required_error: "El usuario agente es requerido" })
        .default("unknown")
        .optional()
});