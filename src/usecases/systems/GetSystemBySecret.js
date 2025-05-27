import { systemsRepository } from "../../domain/repositories/SystemRepositoryImpl.js";

export const getSystemBySecret = async (secret) => {
    try {
        const sanitizedSecret = String(secret).trim()
        if (!sanitizedSecret || sanitizedSecret.length !== 20) throw new Error('El secret ingresado no es válido.');

        const systemFound = await systemsRepository.getSystemBySecret(sanitizedSecret);
        if (systemFound.error) throw new Error(systemFound.error);

        return systemFound;
    } catch (error) {
        return { error: error.message };
    }
}