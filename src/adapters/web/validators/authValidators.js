import { z } from 'zod';

export const loginSchema = z.object({
    secret: z
        .string({ required_error: "El secreto es requerido" })
        .trim()
        .length(20, { message: "El secreto ingresado es inválido" }),
    email: z
        .string({ required_error: "El correo es requerido" })
        .email({ message: "Correo inválido" })
        .transform((val) => val.trim().toLowerCase()),
    password: z
        .string({ required_error: "La contraseña es requerida" })
        .trim()
        .min(3, { message: "La contraseña debe tener 8 caracteres como mínimo" })
});