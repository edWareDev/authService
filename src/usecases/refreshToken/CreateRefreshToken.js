import { addMinutes, addHours, addDays } from 'date-fns';
import { ZodError } from 'zod';
import { TIME_UNIT } from '../constants';
import jwtConfig from '../config/jwtConfig';
import { generateRefreshToken } from '../utils/tokenUtils';
import { RefreshTokenPayload, RefreshToken } from '../models';
import refreshTokensRepository from '../repositories/refreshTokensRepository';

export const createRefreshToken = async ({ userId, systemId }) => {
    try {
        const expirationConfig = jwtConfig.refreshToken.expiresIn;
        if (!expirationConfig) throw new Error("Refresh token expiration not configured.");

        const unit = expirationConfig.slice(-1);
        const quantity = parseInt(expirationConfig.slice(0, -1), 10);
        if (isNaN(quantity)) throw new Error("Invalid refresh token expiration format.");

        const now = new Date();
        let expirationDate;

        switch (unit) {
            case TIME_UNIT.MINUTES:
                expirationDate = addMinutes(now, quantity);
                break;
            case TIME_UNIT.HOURS:
                expirationDate = addHours(now, quantity);
                break;
            case TIME_UNIT.DAYS:
                expirationDate = addDays(now, quantity);
                break;
            default:
                throw new Error("Unsupported time unit in expiration config.");
        }

        const payload = new RefreshTokenPayload({
            emisor: "authService",
            userId,
            systemId,
            expirationDate,
            creationDate: now,
        });

        const refreshTokenValue = await generateRefreshToken(payload);
        if (!refreshTokenValue) throw new Error("Failed to generate refresh token.");

        const tokenToSave = new RefreshToken({
            userId,
            systemId,
            tokenValue: refreshTokenValue,
            tokenIsActive: true,
            expirationDate,
            creationDate: now,
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
