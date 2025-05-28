import { ZodError } from 'zod';
import { generateRefreshToken } from '../../infraestructure/security/jwtService.js';
import { RefreshToken } from '../../domain/entities/RefreshToken.js';
import { refreshTokensRepository } from '../../domain/repositories/RefreshTokenRepositoryImpl.js';
import { decodeToken } from "../../infraestructure/security/jwtService.js";

export const createRefreshToken = async ({ userId, systemId }) => {
    try {
        const payloadRefreshToken = {
            emisor: "authService",
            userId,
            systemId,
        };

        const refreshTokenValue = generateRefreshToken(payloadRefreshToken);
        if (!refreshTokenValue) throw new Error("Failed to generate refresh token.");

        const refreshTokenData = decodeToken(refreshTokenValue);
        if (!refreshTokenData || !refreshTokenData.payload || refreshTokenData.error) throw new Error("Error al decodificar el refresh token.");

        const tokenToSave = new RefreshToken({
            userId,
            systemId,
            tokenValue: refreshTokenValue,
            tokenIsActive: true,
            expirationDate: new Date(refreshTokenData.payload.exp * 1000)
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
