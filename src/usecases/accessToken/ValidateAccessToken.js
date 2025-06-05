import { ZodError } from "zod";
import { verifyAccessToken } from "../../infraestructure/security/jwtService.js";

export const validateAccessToken = (req) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) throw new Error('Error al obtener los datos.', 400, ["Token de autenticación no encontrado."]);

        const accessToken = authHeader.split(' ')[1];
        if (!accessToken || accessToken === '') throw new Error('Error al obtener los datos.', 400, ["Token de autenticación no encontrado."]);

        const accessTokenData = verifyAccessToken(accessToken);
        if (accessTokenData.error === 'jwt expired') throw new Error('Error al obtener los datos.', 401, ["Token de autenticación expirado."]);
        if (!accessTokenData || accessTokenData.error) throw new Error('Error al obtener los datos.', 400, ["Token de autenticación inválido."]);

        return accessTokenData;
    } catch (error) {
        if (error instanceof ZodError) {
            return { error: error.errors.map(e => e.message) };
        }
        return { error: error.message || "Unexpected error" };
    }
};
