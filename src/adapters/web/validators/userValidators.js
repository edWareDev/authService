import { z } from 'zod';

export const createUserSchema = z.object({
    name: z
        .string({ required_error: "El nombre es requerido" })
        .trim()
        .min(3, { message: "El nombre debería tener por lo menos 3 caracteres" })
        .max(50, { message: "El nombre no puede tener más de 50 caracteres" }),
    dni: z
        .string({ required_error: "El DNI es requerido" })
        .trim()
        .length(8, { message: "El DNI debe tener exactamente 8 caracteres" })
        .regex(/^\d+$/, { message: "El DNI debe contener solo números" }),
    email: z
        .string({ required_error: "El correo es requerido" })
        .email({ message: "Correo inválido" })
        .transform((val) => val.trim().toLowerCase()),
    password: z
        .string({ required_error: "La contraseña es requerida" })
        .trim()
        .min(8, { message: "La contraseña debe tener 8 caracteres como mínimo" })
        .max(32, { message: "La contraseña no debe sobrepasar los 32 caracteres" })
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
        .refine(val => !val || val.length >= 8, { message: "El nombre debería tener por lo menos 8 caracteres" })
        .refine(val => !val || val.length <= 50, { message: "El nombre no puede tener más de 50 caracteres" })
        .optional(),
    dni: z
        .string({ required_error: "El DNI es requerido" })
        .trim()
        .length(8, { message: "El DNI debe tener exactamente 8 caracteres" })
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
        .refine(val => !val || val.length >= 8, { message: "La contraseña debe tener 8 caracteres como mínimo" })
        .refine(val => !val || val.length <= 32, { message: "La contraseña no debe sobrepasar los 32 caracteres" })
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