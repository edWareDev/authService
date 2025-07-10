import { ZodError } from 'zod';
import { RefreshToken } from '../../domain/entities/RefreshToken.js';
import { refreshTokensRepository } from '../../domain/repositories/RefreshTokenRepositoryImpl.js';
import { getRefreshTokenByValue } from './GetRefreshTokenByValue.js';

export const disableRefreshToken = async (tokenValue) => {
    try {

        const tokenFound = await getRefreshTokenByValue(tokenValue);
        if (tokenFound.error) throw new Error(tokenFound.error);


        const tokenToSave = new RefreshToken({
            userId: tokenFound.userId,
            systemId: tokenFound.systemId,
            tokenValue: tokenFound.tokenValue,
            tokenIsActive: false,
            expirationDate: tokenFound.expirationDate
        });

        const savedToken = await refreshTokensRepository.updateRefreshToken(tokenFound._id, tokenToSave);
        if (savedToken?.error) throw new Error(savedToken.error);

        return savedToken;
    } catch (error) {
        if (error instanceof ZodError) {
            return { error: error.errors.map(e => e.message) };
        }
        return { error: error.message || "Unexpected error" };
    }
};
