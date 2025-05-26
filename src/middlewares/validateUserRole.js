import { CustomError } from "../utils/CustomError.js";
import { fetchResponse } from "../utils/fetchResponse.js";

export const validatePermissions = (allowedUserRoles) => {

    const userRoles = Array.isArray(allowedUserRoles) ? allowedUserRoles : [allowedUserRoles];

    return (req, res, next) => {
        const { user } = req;

        try {
            if (!user) throw new CustomError('Error al obtener los datos.', 403, ["No tienes permiso para acceder a esta ruta."]);

            if (!userRoles.includes(user.userRole)) throw new CustomError('Error al obtener los datos.', 403, ["Este usuario no tiene permiso para acceder a esta ruta."]);

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
