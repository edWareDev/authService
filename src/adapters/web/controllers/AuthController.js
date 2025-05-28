import { authenticateUser } from "../../../usecases/users/AuthenticateUser.js";
import { CustomError } from "../../../utils/CustomError.js";
import { fetchResponse } from "../../../utils/fetchResponse.js";

export async function controllerLogin(req, res) {
    try {
        const authenticationData = await authenticateUser(req.body);
        if (authenticationData.error) throw new CustomError('Error al iniciar sesión.', 400, authenticationData.error);

        res.cookie('refreshToken', authenticationData.refreshToken.tokenValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(authenticationData.refreshToken.expirationDate),
            sameSite: 'None',
            path: '/auth'
        });
        fetchResponse(res, { statusCode: 200, message: 'Sesión iniciada correctamente.', data: authenticationData.accessToken });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}