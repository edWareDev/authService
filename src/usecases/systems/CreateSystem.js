import { ZodError } from "zod";
import { generatePassword } from "../../utils/passwordGenerator.js";
import { createSystemSchema } from "../../adapters/web/validators/systemValidators.js";
import { System } from "../../domain/entities/System.js";
import { systemsRepository } from "../../domain/repositories/SystemRepositoryImpl.js";
import { SystemConfig } from "./config.js";

export const createSystem = async (data) => {
    try {
        const { name, isActive } = createSystemSchema.parse(data);
        const tempSystem = new System({
            systemName: name,
            systemSecret: generatePassword(SystemConfig.SECRET_LENGTH, { allowSymbols: false }),
            systemToken: generatePassword(SystemConfig.TOKEN_LEGTH, { allowSymbols: true }),
            systemIsActive: isActive,
        });

        const system = await systemsRepository.createSystem(tempSystem);

        if (system.error) throw new Error(system.error);

        return system;
    } catch (e) {
        if (e instanceof ZodError) {
            return { error: JSON.parse(e.message).map(error => error.message) };
        } else if (String(e.message).includes('[')) {
            return { error: JSON.parse(e.message).map(error => error) };
        } else {
            return { error: e.message };
        }
    }
};