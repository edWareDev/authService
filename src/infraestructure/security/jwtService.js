import jwt from "jsonwebtoken"
import { jwtConfig } from "../../../config/jwtConfig.js";


export const generateAccessToken = (payload) => {
    return jwt.sign(payload, jwtConfig.accessToken.secret, { expiresIn: jwtConfig.accessToken.expiresIn, algorithm: jwtConfig.accessToken.algorithm });
}

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, jwtConfig.refreshToken.secret, { expiresIn: jwtConfig.refreshToken.expiresIn, algorithm: jwtConfig.refreshToken.algorithm });
}

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.accessToken.secret, { algorithms: [jwtConfig.accessToken.algorithm] });
    } catch (err) {
        console.error('La verificación del token JWT falló:', err.message);
        return null;
    }
}

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.accessToken.secret, { algorithms: [jwtConfig.accessToken.algorithm] });
    } catch (err) {
        console.error('La verificación del token JWT falló:', err.message);
        return null;
    }
}

export const decodeToken = (token) => {
    try {
        return jwt.decode(token, { complete: true });
    } catch (err) {
        console.error('La decodificación del token JWT falló:', err.message);
        return null;
    }
}