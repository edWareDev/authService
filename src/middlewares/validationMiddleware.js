import { validateAccessToken } from "../usecases/accessToken/ValidateAccessToken.js";
import { getUserById } from "../usecases/users/GetUserById.js";
import { CustomError } from "../utils/CustomError.js";
import { fetchResponse } from "../utils/fetchResponse.js";


export const validationMiddleware = async (req, res, next) => {
    try {
        const accessTokenData = validateAccessToken(req);

        const fechaActual = new Date();
        const fechaCreacion = new Date(accessTokenData.iat * 1000);
        const fechaExpiracion = new Date(accessTokenData.exp * 1000);

        if (fechaExpiracion < fechaActual) throw new CustomError('Error al obtener los datos.', 401, ["Token de autenticación expirado."]);
        if (fechaCreacion > fechaActual) throw new CustomError('Error al obtener los datos.', 401, ["Token de autenticación inválido."]);

        const userFound = await getUserById(accessTokenData.userId);
        if (!userFound) throw new CustomError('Error al obtener los datos.', 404, ["Usuario no encontrado."]);
        if (userFound.error) throw new CustomError('Hubo un error en la solicitud.', 400, ['Acceso no autorizado']);
        if (!userFound.userIsActive || userFound.deletedAt) throw new CustomError('Error al obtener los datos.', 403, ["El usuario no está activo."]);

        req.user = userFound;
        next();
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }

}