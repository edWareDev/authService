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

const REQUEST_LOG_CONFIG = {
    ID_LENGTH_MIN: 1,
    ID_LENGTH_MAX: 100,
    USER_ID_LENGTH_MIN: 1,
    USER_ID_LENGTH_MAX: 50,
};

export const createRequestLogSchema = z.object({
    requestId: z
        .string({
            required_error: "El requestId es requerido",
            invalid_type_error: "El requestId debe ser una cadena de texto"
        })
        .trim()
        .min(REQUEST_LOG_CONFIG.ID_LENGTH_MIN, "El requestId no puede estar vacío")
        .max(REQUEST_LOG_CONFIG.ID_LENGTH_MAX, "El requestId es demasiado largo"),
    userId: z
        .string()
        .trim()
        .min(REQUEST_LOG_CONFIG.USER_ID_LENGTH_MIN, "El token no puede estar vacío")
        .max(REQUEST_LOG_CONFIG.USER_ID_LENGTH_MAX, "El token es demasiado largo")
        .nullable()
        .optional(),
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

const RESPONSE_LOG_CONFIG = {
    STATUS_CODE_MIN: 100,
    STATUS_CODE_MAX: 599,
    ERROR_CODE_MIN: 1,
    ERROR_CODE_MAX: 300,
    MESSAGE_LENGTH_MAX: 500
};

export const createResponseLogSchema = z.object({
    requestId: z
        .string({
            required_error: "El requestId es requerido",
            invalid_type_error: "El requestId debe ser una cadena de texto"
        })
        .trim()
        .min(REQUEST_LOG_CONFIG.ID_LENGTH_MIN, "El requestId no puede estar vacío")
        .max(REQUEST_LOG_CONFIG.ID_LENGTH_MAX, "El requestId es demasiado largo"),
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
        .min(RESPONSE_LOG_CONFIG.STATUS_CODE_MIN, `El statusCode debe ser un código HTTP válido (${RESPONSE_LOG_CONFIG.STATUS_CODE_MIN}-${RESPONSE_LOG_CONFIG.STATUS_CODE_MAX})`)
        .max(RESPONSE_LOG_CONFIG.STATUS_CODE_MAX, `El statusCode debe ser un código HTTP válido (${RESPONSE_LOG_CONFIG.STATUS_CODE_MIN}-${RESPONSE_LOG_CONFIG.STATUS_CODE_MAX})`)
        .nullable()
        .optional(),
    errorCode: z
        .array(
            z.string()
                .trim()
                .min(RESPONSE_LOG_CONFIG.ERROR_CODE_MIN, "Cada código de error debe tener al menos 1 carácter")
                .max(RESPONSE_LOG_CONFIG.ERROR_CODE_MAX, "Cada código de error es demasiado largo")
        )
        .nullable()
        .optional(),
    message: z
        .string()
        .trim()
        .max(RESPONSE_LOG_CONFIG.MESSAGE_LENGTH_MAX, "El message es demasiado largo")
        .nullable()
        .optional(),
});

const SYSTEM_LOG_CONFIG = {
    ERROR_CODE_MIN: 1,
    MESSAGE_LENGTH_MIN: 1,
    MESSAGE_LENGTH_MAX: 500,
};

export const createSystemLogSchema = z.object({
    errorCode: z
        .array(
            z.string()
                .trim()
                .min(SYSTEM_LOG_CONFIG.ERROR_CODE_MIN, "Cada código de error debe tener al menos 1 carácter")
        )
        .optional()
        .nullable(),
    message: z
        .string()
        .trim()
        .min(SYSTEM_LOG_CONFIG.MESSAGE_LENGTH_MIN, "El mensaje no puede estar vacío")
        .max(SYSTEM_LOG_CONFIG.MESSAGE_LENGTH_MAX, "El mensaje es demasiado largo"),
    severityLevel: z
        .enum(["info", "warning", "error", "critical", "fatal"]),
});