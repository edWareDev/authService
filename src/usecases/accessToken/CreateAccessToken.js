import { ZodError } from 'zod';
import { generateAccessToken } from "../../infraestructure/security/jwtService.js";

export const createAccessToken = ({ userId, systemId }) => {
    try {
        const payloadAccessToken = {
            emisor: "authService",
            userId: String(userId),
            systemId: String(systemId),
        };

        const accessTokenValue = generateAccessToken(payloadAccessToken);
        if (!accessTokenValue || accessTokenValue.error) throw new Error("Error al generar el token de acceso");

        return accessTokenValue;
    } catch (error) {
        if (error instanceof ZodError) {
            return { error: error.errors.map(e => e.message) };
        }
        return { error: error.message || "Unexpected error" };
    }
};
