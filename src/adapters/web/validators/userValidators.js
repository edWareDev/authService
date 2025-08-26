import { z } from 'zod';

const USER_CONFIG = {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 50,
    DNI_LENGTH: 8,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 32

};

export const createUserSchema = z.object({
    name: z
        .string({ required_error: "El nombre es requerido" })
        .trim()
        .min(USER_CONFIG.NAME_MIN_LENGTH, { message: `El nombre debería tener por lo menos ${USER_CONFIG.NAME_MIN_LENGTH} caracteres` })
        .max(USER_CONFIG.NAME_MAX_LENGTH, { message: `El nombre no puede tener más de ${USER_CONFIG.NAME_MAX_LENGTH} caracteres` }),
    dni: z
        .string({ required_error: "El DNI es requerido" })
        .trim()
        .length(USER_CONFIG.DNI_LENGTH, { message: `El DNI debe tener exactamente ${USER_CONFIG.DNI_LENGTH} caracteres` })
        .regex(/^\d+$/, { message: "El DNI debe contener solo números" }),
    email: z
        .string({ required_error: "El correo es requerido" })
        .email({ message: "Correo inválido" })
        .transform((val) => val.trim().toLowerCase()),
    password: z
        .string({ required_error: "La contraseña es requerida" })
        .trim()
        .min(USER_CONFIG.PASSWORD_MIN_LENGTH, { message: `La contraseña debe tener ${USER_CONFIG.PASSWORD_MIN_LENGTH} caracteres como mínimo` })
        .max(USER_CONFIG.PASSWORD_MAX_LENGTH, { message: `La contraseña no debe sobrepasar los ${USER_CONFIG.PASSWORD_MAX_LENGTH} caracteres` })
        .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula" })
        .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula" })
        .regex(/\d/, { message: "La contraseña debe contener al menos un número" })
        .regex(/[@$!%*?&#]/, { message: "La contraseña debe contener al menos un carácter especial (@,$,!,%,*,?,&,#)" }),
    role: z
        .enum(["administrator", "user"], { message: "El rol ingresado no es válido" }),
    isActive: z
        .boolean()
        .optional()
});

export const updateUserSchema = z.object({
    name: z
        .string()
        .transform(val => val?.trim())
        .refine(val => !val || val.length >= USER_CONFIG.NAME_MIN_LENGTH, { message: `El nombre debería tener por lo menos ${USER_CONFIG.NAME_MIN_LENGTH} caracteres` })
        .refine(val => !val || val.length <= USER_CONFIG.NAME_MAX_LENGTH, { message: `El nombre no puede tener más de ${USER_CONFIG.NAME_MAX_LENGTH} caracteres` })
        .optional(),
    dni: z
        .string({ required_error: "El DNI es requerido" })
        .trim()
        .length(USER_CONFIG.DNI_LENGTH, { message: `El DNI debe tener exactamente ${USER_CONFIG.DNI_LENGTH} caracteres` })
        .regex(/^\d+$/, { message: "El DNI debe contener solo números" })
        .optional(),
    email: z
        .string()
        .transform(val => val?.trim().toLowerCase())
        .refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: "Correo inválido" })
        .optional(),
    password: z
        .string()
        .transform(val => val?.trim())
        .refine(val => !val || val.length >= USER_CONFIG.PASSWORD_MIN_LENGTH, { message: `La contraseña debe tener ${USER_CONFIG.PASSWORD_MIN_LENGTH} caracteres como mínimo` })
        .refine(val => !val || val.length <= USER_CONFIG.PASSWORD_MAX_LENGTH, { message: `La contraseña no debe sobrepasar los ${USER_CONFIG.PASSWORD_MAX_LENGTH} caracteres` })
        .refine(val => !val || /[A-Z]/.test(val), { message: "La contraseña debe contener al menos una letra mayúscula" })
        .refine(val => !val || /[a-z]/.test(val), { message: "La contraseña debe contener al menos una letra minúscula" })
        .refine(val => !val || /\d/.test(val), { message: "La contraseña debe contener al menos un número" })
        .refine(val => !val || /[@$!%*?&#]/.test(val), { message: "La contraseña debe contener al menos un carácter especial (@,$,!,%,*,?,&,#)" })
        .optional(),
    role: z
        .enum(["administrator", "user"], { message: "El rol ingresado no es válido" })
        .optional(),
    isActive: z
        .boolean()
        .optional()
});