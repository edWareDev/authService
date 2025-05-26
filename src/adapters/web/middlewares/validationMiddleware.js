import { getUserByToken } from "../../../usecases/users/GetUserByToken.js";
import { CustomError } from "../../../utils/CustomError.js";
import { fetchResponse } from "../../../utils/fetchResponse.js";


export const validateBearerToken = async (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization']
        if (typeof bearerHeader !== 'undefined' || bearerHeader !== undefined) {
            const bearerToken = bearerHeader.split(' ')[1];
            const userFound = await getUserByToken(bearerToken);
            if (userFound) {
                if (userFound.error) throw new CustomError('Hubo un error en la solicitud.', 400, 'Acceso no autorizado');
                if (!userFound.userIsActive) throw new CustomError('Hubo un error en la solicitud.', 401, 'Usuario Inactivo');
                req['user'] = userFound
                next();
            } else {
                fetchResponse(res, { statusCode: 401, message: 'Usuario no autorizado.', errorCode: null, data: null });
            }
        } else {
            fetchResponse(res, { statusCode: 403, message: 'Acceso Denegado', errorCode: null, data: null });
        }
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }

}

export const justAdmin = async (req, res, next) => {
    try {
        const userInfo = req.userInfo;

        if (userInfo) {
            if (userInfo.userRole !== 'admin') throw new CustomError('Hubo un error en la solicitud.', 401, 'No tienes los privilegios para acceder a este recurso');
            next();
        } else {
            fetchResponse(res, { statusCode: 401, message: 'Usuario no autorizado.', errorCode: null, data: null });
        }
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }

}

export const justAdminAndPartner = async (req, res, next) => {
    try {
        const userInfo = req.userInfo;
        if (userInfo) {
            if (userInfo.userRole !== 'admin' && userInfo.userRole !== 'partner') throw new CustomError('Hubo un error en la solicitud.', 401, 'No tienes los privilegios para acceder a este recurso');
            next();
        } else {
            fetchResponse(res, { statusCode: 401, message: 'Usuario no autorizado.', errorCode: null, data: null });
        }
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }

}