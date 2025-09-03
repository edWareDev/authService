import { verifyAccessToken } from "../../infraestructure/security/jwtService.js";
import { HTTP_CODES } from "../../utils/http_error_codes.js";

export const validateAccessToken = (req) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) throw new Error('Error al obtener los datos.', HTTP_CODES._400_BAD_REQUEST, ["Token de autenticación no encontrado."]);

        const accessToken = String(authHeader.split(' ')[1]).trim();
        if (!accessToken || accessToken === '') throw new Error('Token de autenticación no encontrado.');

        const accessTokenData = verifyAccessToken(accessToken);
        // console.log("🚀 ~ validateAccessToken ~ accessTokenData:", accessTokenData);
        // if (accessTokenData.error === 'jwt expired') throw new Error('Error al obtener los datos.', HTTP_CODES._401_UNAUTHORIZED, ["Token de autenticación expirado."]);
        // if (!accessTokenData || accessTokenData.error) throw new Error('Error al obtener los datos.', HTTP_CODES._400_BAD_REQUEST, ["Token de autenticación inválido."]);

        return accessTokenData;
    } catch (error) {
        console.log(error.message);
        return { error: error.message || "Unexpected error" };
    }
};
