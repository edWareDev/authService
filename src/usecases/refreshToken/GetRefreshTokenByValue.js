import { ZodError } from 'zod';
import { refreshTokensRepository } from '../../domain/repositories/RefreshTokenRepositoryImpl.js';

export const getRefreshTokenByValue = async (tokenValue) => {
    try {
        const sanitizedTokenValue = String(tokenValue).trim();
        if (!sanitizedTokenValue) throw new Error('El token ingresado no es válido.');

        const refreshTokenFound = await refreshTokensRepository.getRefreshTokenByValue(sanitizedTokenValue);
        if (refreshTokenFound.error) throw new Error(refreshTokenFound.error);

        return refreshTokenFound;
    } catch (error) {
        if (error instanceof ZodError) {
            return { error: error.errors.map(e => e.message) };
        }
        return { error: error.message || "Unexpected error" };
    }
};
