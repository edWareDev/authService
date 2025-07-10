import { allowedOrigins } from "../../../../config/cors-config.js";

const originCache = new Map();
const CACHE_SIZE_LIMIT = 50;

// Separa orígenes string y regex para búsquedas eficientes
const { stringOrigins, regexOrigins } = (() => {
    const strings = new Set();
    const regexes = [];
    allowedOrigins.forEach(origin => {
        if (typeof origin === 'string') strings.add(origin);
        else if (origin instanceof RegExp) regexes.push(origin);
    });
    return { stringOrigins: strings, regexOrigins: regexes };
})();

function isAllowedOrigin(origin) {
    if (!origin) return false;
    if (originCache.has(origin)) return originCache.get(origin);
    if (stringOrigins.has(origin)) {
        cacheResult(origin, true);
        return true;
    }
    for (const regex of regexOrigins) {
        if (regex.test(origin)) {
            cacheResult(origin, true);
            return true;
        }
    }
    cacheResult(origin, false);
    return false;
}

function cacheResult(origin, result) {
    if (originCache.size >= CACHE_SIZE_LIMIT) {
        // Elimina el primer elemento (LRU simple)
        const firstKey = originCache.keys().next().value;
        originCache.delete(firstKey);
    }
    originCache.set(origin, result);
}

const CORS_HEADERS = {
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    headers: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: 'true'
};

function deny(res) {
    res.status(403).send("Acceso Bloqueado por CORS").end();
}

export const corsMiddleware = (req, res, next) => {
    const origin = req.headers.origin;

    // Siempre indicar que la respuesta puede variar según el Origin
    res.set('Vary', 'Origin');

    if (req.method === 'OPTIONS') {
        if (origin && isAllowedOrigin(origin)) {
            res.set({
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': CORS_HEADERS.methods,
                'Access-Control-Allow-Headers': CORS_HEADERS.headers,
                'Access-Control-Allow-Credentials': CORS_HEADERS.credentials
            });
            return res.status(200).end();
        }
        return deny(res);
    }

    if (!origin) return next();

    if (isAllowedOrigin(origin)) {
        res.set({
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': CORS_HEADERS.credentials
        });
        return next();
    }

    return deny(res);
};