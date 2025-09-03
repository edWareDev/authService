import { HTTP_CODES } from "../../utils/http_error_codes.js";
import { getSystemByToken } from "./GetSystemByToken.js";

export const validateSystemToken = async (req) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) throw new Error('Error al obtener los datos.', HTTP_CODES._400_BAD_REQUEST, ["Token de autenticación no encontrado."]);

        const accessToken = String(authHeader.split(' ')[1]).trim();
        if (!accessToken || accessToken === '') throw new Error('Error al obtener los datos.', HTTP_CODES._400_BAD_REQUEST, ["Token de autenticación no encontrado."]);

        const system = await getSystemByToken(accessToken);
        if (!system || system.error) throw new Error('Error al validar el token del sistema.', HTTP_CODES._400_BAD_REQUEST, ["Token de autenticación inválida."]);
        return system;

    } catch (error) {
        return { error: error.message || "Error validando el token de sistema" };
    }
};