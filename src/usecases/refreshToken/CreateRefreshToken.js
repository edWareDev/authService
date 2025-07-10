import { ZodError } from 'zod';
import { generateRefreshToken, verifyRefreshToken } from '../../infraestructure/security/jwtService.js';
import { RefreshToken } from '../../domain/entities/RefreshToken.js';
import { refreshTokensRepository } from '../../domain/repositories/RefreshTokenRepositoryImpl.js';

export const createRefreshToken = async ({ userId, systemId }) => {
    try {
        const payloadRefreshToken = {
            iss: "authService",
            sub: String(userId),
            aud: String(systemId),
        };

        const refreshTokenValue = generateRefreshToken(payloadRefreshToken);
        if (!refreshTokenValue) throw new Error("Failed to generate refresh token.");

        const refreshTokenData = verifyRefreshToken(refreshTokenValue);
        if (!refreshTokenData || refreshTokenData.error) throw new Error(refreshTokenData?.error || "Error al verificar el refresh token.");

        const tokenToSave = new RefreshToken({
            userId,
            systemId,
            tokenValue: refreshTokenValue,
            tokenIsActive: true,
            expirationDate: new Date(refreshTokenData.exp * 1000)
        });

        const savedToken = await refreshTokensRepository.createRefreshToken(tokenToSave);
        if (savedToken?.error) throw new Error(savedToken.error);

        return savedToken;
    } catch (error) {
        if (error instanceof ZodError) {
            return { error: error.errors.map(e => e.message) };
        }
        return { error: error.message || "Unexpected error" };
    }
};
