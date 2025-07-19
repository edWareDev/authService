import { z } from 'zod';

const LOGIN_SCHEMA_CONFIG = {
    SECRET_LENGTH: 20,
    PASSWORD_MIN_LENGTH: 3
};

export const loginSchema = z.object({
    secret: z
        .string({ required_error: "El secreto es requerido" })
        .trim()
        .length(LOGIN_SCHEMA_CONFIG.SECRET_LENGTH, { message: "El secreto ingresado es inválido" }),
    email: z
        .string({ required_error: "El correo es requerido" })
        .email({ message: "Correo inválido" })
        .transform((val) => val.trim().toLowerCase()),
    password: z
        .string({ required_error: "La contraseña es requerida" })
        .trim()
        .min(LOGIN_SCHEMA_CONFIG.PASSWORD_MIN_LENGTH, { message: `La contraseña debe tener ${LOGIN_SCHEMA_CONFIG.PASSWORD_MIN_LENGTH} caracteres como mínimo` })
});