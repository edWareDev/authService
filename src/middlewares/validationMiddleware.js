import { getUserByToken } from "../usecases/users/GetUserByToken.js";
import { CustomError } from "../utils/CustomError.js";
import { fetchResponse } from "../utils/fetchResponse.js";


export const validateBearerToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) throw new CustomError('Error al obtener los datos.', 401, ["Token de autenticación no encontrado."]);

        const token = authHeader.split(' ')[1];
        if (!token || token.length !== 40) throw new CustomError('Error al obtener los datos.', 403, ["Token de autenticación inválido."]);

        const userFound = await getUserByToken(token);
        if (!userFound) throw new CustomError('Error al obtener los datos.', 404, ["Usuario no encontrado."]);
        if (userFound.error) throw new CustomError('Hubo un error en la solicitud.', 401, ['Acceso no autorizado']);
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