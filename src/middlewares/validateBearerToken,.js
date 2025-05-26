import { getExternalAppByToken } from "../usecases/externalApps/GetExternalAppByToken.js";
import { getUserByToken } from "../usecases/users/GetUserByToken.js";
import { CustomError } from "../utils/CustomError.js";
import { fetchResponse } from "../utils/fetchResponse.js";

export const validateBearerToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new CustomError('Error al obtener los datos.', 401, ["Token de autenticación no encontrado."]);
        }

        const token = authHeader.split(' ')[1];
        if (!token || token.length !== 40) {
            throw new CustomError('Error al obtener los datos.', 403, ["Token de autenticación inválido."]);
        }

        const userFound = await getUserByToken(token);

        if (!userFound || userFound.error) {
            const externalAppFound = await getExternalAppByToken(token);

            if (!externalAppFound || externalAppFound.error) {
                throw new CustomError('Error al obtener los datos.', 403, [
                    "Token de autenticación inválido.",
                    userFound?.error || externalAppFound?.error || null
                ].filter(Boolean));
            }

            if (!externalAppFound.externalAppIsActive || externalAppFound.deletedAt) {
                throw new CustomError('Error al obtener los datos.', 403, ["La aplicación externa no está activa."]);
            }

            req.externalApp = externalAppFound;
        } else {
            if (!userFound.userIsActive || userFound.deletedAt) {
                throw new CustomError('Error al obtener los datos.', 403, ["El usuario no está activo."]);
            }

            req.user = userFound;
        }

        next();
    } catch (error) {
        // Manejo de errores
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            console.error('Error inesperado en validateBearerToken:', error);
            fetchResponse(res, {
                statusCode: 500,
                errorCode: "ERR_UNEXPECTED",
                message: "Ha ocurrido un error inesperado"
            });
        }
    }
};