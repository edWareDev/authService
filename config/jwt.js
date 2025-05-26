const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-super-secret-jwt-key';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET_KEY || 'your-super-secret-refresh-key';

export const jwtConfig = {
    accessToken: {
        secret: JWT_SECRET,
        expiresIn: '1h'
    },
    refreshToken: {
        secret: REFRESH_TOKEN_SECRET,
        expiresIn: '7d'
    }
};