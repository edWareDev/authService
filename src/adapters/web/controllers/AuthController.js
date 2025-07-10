import { verifyAccessToken, verifyRefreshToken } from "../../../infraestructure/security/jwtService.js";
import { createAccessToken } from "../../../usecases/accessToken/CreateAccessToken.js";
import { disableRefreshToken } from "../../../usecases/refreshToken/DisableRefreshToken.js";
import { authenticateUser } from "../../../usecases/users/AuthenticateUser.js";
import { CustomError } from "../../../utils/CustomError.js";
import { fetchResponse } from "../../../utils/fetchResponse.js";

export async function controllerLogin(req, res) {
    try {
        const authenticationData = await authenticateUser(req.body);
        if (authenticationData.error) throw new CustomError('Error al iniciar sesión.', 400, authenticationData.error);

        res.cookie('refreshToken', authenticationData.refreshToken.tokenValue, {
            httpOnly: true,
            secure: false, //process.env.NODE_ENV === 'production',
            expires: new Date(authenticationData.refreshToken.expirationDate),
            sameSite: 'None',
            path: '/auth'
        });
        fetchResponse(res, { statusCode: 200, message: 'Sesión iniciada correctamente.', data: { accessToken: authenticationData.accessToken } });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}

export async function controllerValidateAccessToken(req, res) {
    try {
        const { accessToken } = req.body;
        if (!accessToken || accessToken === '') throw new CustomError('Hubo un error al validar el token', 400, "El access token es invñalido o no fue enviado.");

        const tokenData = verifyAccessToken(accessToken);
        if (!tokenData || tokenData.error) throw new CustomError('Hubo un error al refrescar el token', 400, [tokenData?.error || "El refresh token es inválido"]);

        fetchResponse(res, { statusCode: 200, message: 'Sesión iniciada correctamente.', data: { tokenData } });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}

export async function controllerRefreshAccessToken(req, res) {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken || refreshToken === '') throw new CustomError('Hubo un error al cerrar la sesión', 400, "El refresh token no fue encontrado.");

        const tokenData = verifyRefreshToken(refreshToken);
        console.log("🚀 ~ controllerRefreshToken ~ tokenData:", tokenData)
        if (!tokenData || tokenData.error) throw new CustomError('Hubo un error al refrescar el token', 400, [tokenData?.error || "El refresh token es inválido"]);

        const accessToken = createAccessToken({ userId: tokenData.sub, systemId: tokenData.aud });
        if (!accessToken || accessToken.error) throw new CustomError('Hubo un error al refrescar el token', 400, [tokenData?.error || "No fue posible crear el access token"]);

        fetchResponse(res, { statusCode: 200, message: 'Sesión iniciada correctamente.', data: { accessToken } });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}

export async function controllerLogout(req, res) {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken || refreshToken === '') throw new CustomError('Hubo un error al cerrar la sesión', 400, "El refresh token no fue encontrado.");

        const tokenData = verifyRefreshToken(refreshToken);
        if (!tokenData || tokenData.error) throw new CustomError('Hubo un error al cerrar la sesión', 400, [tokenData?.error || "El rfresh token es inválido"]);

        const disabledToken = await disableRefreshToken(refreshToken);
        if (!disabledToken || disabledToken.error) throw new CustomError("No se pudo desactivar el refresh token.", 400, "El token ya fue desactivado o no existe.");
        const cookieInfo = {
            httpOnly: true,
            secure: false,//process.env.NODE_ENV === 'production',
            sameSite: 'None',
            path: '/auth'
        }
        console.log("🚀 ~ controllerLogout ~ cookieInfo:", cookieInfo)

        res.clearCookie('refreshToken', cookieInfo);
        fetchResponse(res, { statusCode: 200, message: "Sesión cerrada correctamente." });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}
