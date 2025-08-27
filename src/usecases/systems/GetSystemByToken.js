import { systemsRepository } from "../../domain/repositories/SystemRepositoryImpl.js";
import { SystemConfig } from "./config.js";

export const getSystemByToken = async (token) => {
    try {
        const sanitizedToken = String(token).trim();
        if (!sanitizedToken || sanitizedToken.length !== SystemConfig.TOKEN_LEGTH) throw new Error('El token ingresado no es válido.');

        const systemFound = await systemsRepository.getSystemByToken(sanitizedToken);
        if (systemFound.error) throw new Error(systemFound.error);

        return systemFound;
    } catch (error) {
        return { error: error.message };
    }
};