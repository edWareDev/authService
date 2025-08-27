import { systemsRepository } from "../../domain/repositories/SystemRepositoryImpl.js";
import { SystemConfig } from "../systems/config.js";

export const getSystemBySecret = async (secret) => {
    try {
        const sanitizedSecret = String(secret).trim();
        if (!sanitizedSecret || sanitizedSecret.length !== SystemConfig.SECRET_LENGTH) throw new Error('El secret ingresado no es válido.');

        const systemFound = await systemsRepository.getSystemBySecret(sanitizedSecret);
        if (systemFound.error) throw new Error(systemFound.error);

        return systemFound;
    } catch (error) {
        return { error: error.message };
    }
};