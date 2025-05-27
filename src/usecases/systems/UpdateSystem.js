import { ZodError } from "zod";
import { isValidObjectId } from "mongoose";
import { getSystemById } from "./GetSystemById.js";
import { updateSystemSchema } from "../../adapters/web/validators/systemValidators.js";
import { System } from "../../domain/entities/System.js";
import { systemsRepository } from "../../domain/repositories/SystemRepositoryImpl.js";

export const updateSystem = async (data, id) => {
    try {
        const sanitizedId = String(id).trim()
        if (!isValidObjectId(sanitizedId)) throw new Error('El id ingresado no es válido.');

        const systemFound = await getSystemById(sanitizedId)
        if (!systemFound) throw new Error('El sistema no existe.');
        if (systemFound.error) throw new Error(systemFound.error);

        const { name, isActive } = updateSystemSchema.parse(data)
        const systemNewData = new System({
            systemName: (typeof name !== 'undefined') ? String(name).trim() : systemFound.systemName,
            systemSecret: systemFound.systemSecret,
            systemIsActive: (typeof isActive !== 'undefined') ? isActive : systemFound.systemIsActive,
        })

        const system = await systemsRepository.updateSystem(sanitizedId, systemNewData);

        return system;
    } catch (error) {
        if (error instanceof ZodError) {
            return { error: JSON.parse(error.message).map(error => error.message) };
        } else if (String(error.message).includes('[')) {
            return { error: JSON.parse(error.message).map(error => error) };
        } else {
            return { error: error.message };
        }
    }
}