import { systemsRepository } from "../../domain/repositories/SystemRepositoryImpl.js";
import { SYSTEM_CONFIG } from "./CreateSystem.js";

export const getSystemBySecret = async (secret) => {
    try {
        const sanitizedSecret = String(secret).trim();
        if (!sanitizedSecret || sanitizedSecret.length !== SYSTEM_CONFIG.SECRET_LENGTH) throw new Error('El secret ingresado no es válido.');

        const systemFound = await systemsRepository.getSystemBySecret(sanitizedSecret);
        if (systemFound.error) throw new Error(systemFound.error);

        return systemFound;
    } catch (error) {
        return { error: error.message };
    }
};