import { validateSystemToken } from "../../../usecases/systems/ValidateSystemToken.js";
import { CustomError } from "../../../utils/CustomError.js";
import { fetchResponse } from "../../../utils/fetchResponse.js";
import { HTTP_CODES } from "../../../utils/http_error_codes.js";

export const systemValidationMiddleware = async (req, res, next) => {
    try {
        const systemTokenData = await validateSystemToken(req);
        if (systemTokenData.error) throw new CustomError('Hubo un error en la solicitud.', HTTP_CODES._400_BAD_REQUEST, systemTokenData.error);
        if (!systemTokenData.systemIsActive || systemTokenData.deletedAt) throw new CustomError('Error al obtener los datos.', HTTP_CODES._403_FORBIDDEN, ["El sistema no está activo o fue eliminado."]);

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