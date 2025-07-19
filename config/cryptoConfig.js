const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'your-super-secret-key';
const ENCRYPTION_ALGORITHM = process.env.ENCRYPTION_ALGORITHM || 'HS256';

export const cryptoConfig = {
    secret: ENCRYPTION_SECRET,
    algorithm: ENCRYPTION_ALGORITHM,
    initializationVectorLength: 16,
};