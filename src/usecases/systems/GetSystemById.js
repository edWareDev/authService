import { isValidObjectId } from "mongoose";
import { systemsRepository } from "../../domain/repositories/SystemRepositoryImpl.js";

export const getSystemById = async (id) => {
    try {
        const sanitizedId = String(id).trim()
        if (!isValidObjectId(sanitizedId)) throw new Error('El id ingresado no es válido.');

        const systemFound = await systemsRepository.getSystemById(sanitizedId);
        if (systemFound.error) throw new Error(systemFound.error);

        return systemFound;
    } catch (error) {
        return { error: error.message };
    }
}