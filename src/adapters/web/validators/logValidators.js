import { z } from 'zod';

const HttpMethodEnum = z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']);

const HeadersSchema = z.object({
    'user-agent': z.string().optional(),
    'content-type': z.string().optional(),
    'authorization': z.string().optional(),
    'accept': z.string().optional(),
}).passthrough(); // Permite otros headers sin fallar la validación

const BodySchema = z.union([
    z.object({}).passthrough(),
    z.string(),
    z.array(z.any()),
    z.null()
]);

export const createRequestLogSchema = z.object({
    requestId: z
        .string({
            required_error: "El requestId es requerido",
            invalid_type_error: "El requestId debe ser una cadena de texto"
        })
        .trim()
        .min(1, "El requestId no puede estar vacío")
        .max(100, "El requestId es demasiado largo"),
    userId: z
        .string()
        .trim()
        .min(1, "El token no puede estar vacío")
        .max(50, "El token es demasiado largo")
        .nullable()
        .optional(), // Permite `null` o que no esté presente
    endpoint: z
        .string()
        .trim()
        .min(1, "El endpoint no puede estar vacío")
        .optional(),
    method: HttpMethodEnum.optional().default('GET'),
    headers: HeadersSchema.optional(),
    queryParams: z.record(z.any()).optional(), // Ahora acepta cualquier tipo de valor
    body: BodySchema.optional(),
    ip: z.string().trim().optional(),
});

export const createResponseLogSchema = z.object({
    requestId: z
        .string({
            required_error: "El requestId es requerido",
            invalid_type_error: "El requestId debe ser una cadena de texto"
        })
        .trim()
        .min(1, "El requestId no puede estar vacío")
        .max(100, "El requestId es demasiado largo"),
    responseTime: z.union([
        z.number().min(0, "El responseTime no puede ser negativo"),
        z.null()
    ]).optional(),
    body: z
        .string()
        .optional(),
    statusCode: z
        .number()
        .int("El statusCode debe ser un número entero")
        .min(100, "El statusCode debe ser un código HTTP válido (100-599)")
        .max(599, "El statusCode debe ser un código HTTP válido (100-599)")
        .nullable()
        .optional(),
    errorCode: z
        .array(
            z.string()
                .trim()
                .min(1, "Cada código de error debe tener al menos 1 carácter")
                .max(300, "Cada código de error es demasiado largo")
        )
        .nullable()
        .optional(),
    message: z
        .string()
        .trim()
        .max(500, "El message es demasiado largo")
        .nullable()
        .optional(),
});

export const createSystemLogSchema = z.object({
    errorCode: z
        .array(
            z.string()
                .trim()
                .min(1, "Cada código de error debe tener al menos 1 carácter")
        )
        .optional()
        .nullable(),
    message: z
        .string()
        .trim()
        .max(500, "El mensaje es demasiado largo")
        .min(1, "El mensaje no puede estar vacío"), // Debe ser requerido
    severityLevel: z
        .enum(["info", "warning", "error", "critical", "fatal"]),
});