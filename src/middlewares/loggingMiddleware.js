import { SystemInfo } from '../../config/systemInfo.js';
import { createRequestLog } from '../usecases/logs/CreateRequestLog.js';
import { createResponseLog } from '../usecases/logs/CreateResponseLog.js';
import { nanoid } from 'nanoid';
import { getUserByToken } from '../usecases/users/GetUserByToken.js';

const systemInfo = new SystemInfo();
// Constante para el texto de reemplazo
const PROTECTED = '[PROTECTED]';

const getClientIp = (req) => {
    // Intenta obtener la IP de diferentes headers en orden de prioridad
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
        // Si x-forwarded-for contiene múltiples IPs, toma la primera (la del cliente original)
        const ips = Array.isArray(forwardedFor)
            ? forwardedFor[0]
            : forwardedFor.split(',')[0];
        return ips.trim();
    }

    // Intenta otros headers comunes
    const alternativeHeaders = [
        'cf-connecting-ip',      // Cloudflare
        'x-real-ip',            // Nginx
        'x-client-ip',          // Apache
        'true-client-ip',       // Akamai y Cloudflare
        'x-forwarded',          // General use
        'forwarded-for',        // General use
        'x-cluster-client-ip',  // Google Cloud
        'fastly-client-ip',     // Fastly
    ];

    for (const header of alternativeHeaders) {
        const headerValue = req.headers[header];
        if (headerValue) {
            return Array.isArray(headerValue) ? headerValue[0] : headerValue;
        }
    }

    // Si no se encuentra en los headers, usa req.ip
    // Limpia la IP si viene en formato IPv6
    const ip = req.ip || req.connection.remoteAddress;
    return ip?.replace(/^::ffff:/, '') || 'unknown';
};

const sanitizeHeaders = (headers) => {
    // Convertir headers a un objeto plano y sanitizar valores sensibles
    const sanitized = { ...headers };

    // Lista de headers sensibles a ocultar
    const sensitiveHeaders = [
        'authorization',
        'cookie',
        'x-auth-token',
        'session',
        'api-key',
    ];

    for (const header of sensitiveHeaders) {
        if (sanitized[header]) {
            sanitized[header] = PROTECTED;
        }
    }

    return sanitized;
};

// Set para búsqueda más rápida de campos sensibles
const SENSITIVE_FIELDS = new Set([
    'password',
    'token',
    'secret',
    'apikey',
    'authorization',
    'creditcard',
    'cc'
]);



// Función para verificar si una clave es sensible (memoizada)
const memoizedIsSensitive = (() => {
    const cache = new Map();

    return (key) => {
        const lowercaseKey = key.toLowerCase();

        if (cache.has(lowercaseKey)) {
            return cache.get(lowercaseKey);
        }

        const isSensitive = SENSITIVE_FIELDS.has(lowercaseKey) ||
            Array.from(SENSITIVE_FIELDS).some(field => lowercaseKey.includes(field));

        cache.set(lowercaseKey, isSensitive);
        return isSensitive;
    };
})();

const sanitizeBody = (body, depth = 0, maxDepth = 3) => {
    // Casos base
    if (!body || depth > maxDepth) return body;
    if (typeof body !== 'object' && typeof body !== 'string') return body;

    // Manejo de strings - intenta parsear JSON
    if (typeof body === 'string') {
        try {
            const parsed = JSON.parse(body);
            return sanitizeBody(parsed, depth);
        } catch {
            return body;
        }
    }

    // Uso de Map para mejor rendimiento en objetos grandes
    const sanitized = new Map();
    const isArray = Array.isArray(body);

    // Si es array, procesa directamente
    if (isArray) {
        return body.map(item =>
            typeof item === 'object' && item !== null
                ? sanitizeBody(item, depth + 1)
                : item
        );
    }

    // Procesa el objeto usando Object.entries para mejor rendimiento
    Object.entries(body).forEach(([key, value]) => {
        // Verifica si el campo es sensible
        if (memoizedIsSensitive(key)) {
            sanitized.set(key, PROTECTED);
            return;
        }

        // Procesa objetos anidados
        if (typeof value === 'object' && value !== null) {
            sanitized.set(key, sanitizeBody(value, depth + 1));
            return;
        }

        sanitized.set(key, value);
    });

    // Convierte el Map de vuelta a un objeto
    return Object.fromEntries(sanitized);
};

// Exporta la versión memoizada para uso repetido
const memoizedSanitizeBody = (() => {
    const cache = new WeakMap();

    return (body) => {
        if (!body || typeof body !== 'object') {
            return sanitizeBody(body);
        }

        if (cache.has(body)) {
            return cache.get(body);
        }

        const sanitized = sanitizeBody(body);
        cache.set(body, sanitized);
        return sanitized;
    };
})();

export const createLoggingMiddleware = () => {
    return async (req, res, next) => {

        const requestId = nanoid();
        const startTime = Date.now();

        try {
            let user = null;
            const token = req.headers?.authorization?.split(" ")[1];
            if (token) {
                user = await getUserByToken(token);
                if (user.error) user = null;
            }

            if (systemInfo._LOG_DB_STATUS) {
                await createRequestLog({
                    requestId,
                    userId: user ? user._id.toString() : null,
                    endpoint: `${String(req.originalUrl || req.url).split('?')[0]}`,
                    method: req.method,
                    headers: sanitizeHeaders(req.headers),
                    queryParams: req.query,
                    body: memoizedSanitizeBody(req.body),
                    ip: getClientIp(req)
                });
            }

            // Intercepta la respuesta
            const originalSend = res.send;
            res.send = async function (body) {
                const responseTime = Date.now() - startTime;
                const sanitizedBody = sanitizeBody(body)
                // Log de la respuesta
                if (systemInfo._LOG_DB_STATUS) {
                    const responseDATA = {
                        requestId,
                        responseTime,
                        body: body,
                        statusCode: sanitizedBody.statusCode,
                        errorCode: sanitizedBody.errorCode || null,
                        message: sanitizedBody.message
                    }
                    await createResponseLog(responseDATA)
                }

                return originalSend.apply(res, arguments);
            };

            next();
        } catch (error) {
            console.error('Error en logging middleware:', error);
            next(); // Continúa incluso si hay error en el logging
        }
    };
};