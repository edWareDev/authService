const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://172.16.11.246:5173',
    'http://172.16.11.246:5174',
    'https://admin.globaltv.lat',
    /^http:\/\/localhost:\d+$/
];

export const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.error(`🚫 CORS bloqueado para: ${origin}`);
        callback(new Error('Acceso no permitido por CORS'));
    },
};