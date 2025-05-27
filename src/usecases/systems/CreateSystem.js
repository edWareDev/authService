import { ZodError } from "zod";
import { generatePassword } from "../../utils/passwordGenerator.js";
import { createSystemSchema } from "../../adapters/web/validators/systemValidators.js";
import { System } from "../../domain/entities/System.js";
import { systemsRepository } from "../../domain/repositories/SystemRepositoryImpl.js";


export const createSystem = async (data) => {
    try {
        const { name, isActive } = createSystemSchema.parse(data)
        const tempSystem = new System({
            systemName: name,
            systemSecret: generatePassword(20),
            systemIsActive: isActive,
        })

        const system = await systemsRepository.createSystem(tempSystem);

        if (system.error) throw new Error(system.error);

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