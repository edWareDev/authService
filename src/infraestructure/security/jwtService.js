import jwt from "jsonwebtoken"
import { jwtConfig } from "../../../config/jwtConfig.js";


export const generateAccessToken = (payload) => {
    try {
        return jwt.sign(payload, jwtConfig.accessToken.secret, { expiresIn: jwtConfig.accessToken.expiresIn, algorithm: jwtConfig.accessToken.algorithm });
    } catch (error) {
        return { error: error.message || "Error al generar el token de acceso" };
    }
}

export const generateRefreshToken = (payload) => {
    try {
        return jwt.sign(payload, jwtConfig.refreshToken.secret, { expiresIn: jwtConfig.refreshToken.expiresIn, algorithm: jwtConfig.refreshToken.algorithm });
    } catch (error) {
        return { error: error.message || "Error al generar el token de actualización" };
    }
}

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.accessToken.secret, { algorithms: [jwtConfig.accessToken.algorithm] });
    } catch (error) {
        return { error: error.message || "Error al verificar el access token" };
    }
}

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.refreshToken.secret, { algorithms: [jwtConfig.refreshToken.algorithm] });
    } catch (error) {
        return { error: error.message || "Error al verificar el refresh token" };
    }
}