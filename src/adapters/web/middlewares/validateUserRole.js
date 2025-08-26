import { CustomError } from "../../../utils/CustomError.js";
import { fetchResponse } from "../../../utils/fetchResponse.js";
import { HTTP_CODES } from "../../../utils/http_error_codes.js";

export const validatePermissions = (allowedUserRoles) => {

    const userRoles = Array.isArray(allowedUserRoles) ? allowedUserRoles : [allowedUserRoles];

    return (req, res, next) => {
        const { user } = req;

        try {
            if (!user) throw new CustomError('Error al obtener los datos.', HTTP_CODES._403_FORBIDDEN, ["No tienes permiso para acceder a esta ruta."]);

            if (!userRoles.includes(user.userRole)) throw new CustomError('Error al obtener los datos.', HTTP_CODES._403_FORBIDDEN, ["Este usuario no tiene permiso para acceder a esta ruta."]);

            next();
        } catch (error) {
            if (error instanceof CustomError) {
                const { message, httpErrorCode, errorCode } = error.toJSON();
                fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
            } else {
                fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
            }
        }
    };
};
