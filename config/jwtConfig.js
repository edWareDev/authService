const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-super-secret-jwt-key';
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY || 'your-super-secret-refresh-key';
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256';

export const jwtConfig = {
    accessToken: {
        secret: JWT_SECRET_KEY,
        expiresIn: '1h',
        algorithm: JWT_ALGORITHM
    },
    refreshToken: {
        secret: JWT_REFRESH_KEY,
        expiresIn: '7d',
        algorithm: JWT_ALGORITHM
    }
};