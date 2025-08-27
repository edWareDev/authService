import { generatePassword } from "../../utils/passwordGenerator.js";
import { isValidObjectId } from "mongoose";
import { getSystemById } from "./GetSystemById.js";
import { System } from "../../domain/entities/System.js";
import { systemsRepository } from "../../domain/repositories/SystemRepositoryImpl.js";
import { SystemConfig } from "./config.js";


export const deleteSystem = async (id, idUser) => {
    try {
        const idSanitized = String(id).trim();
        if (!isValidObjectId(idSanitized)) throw new Error("El id ingresado no es válido.");
        const systemFound = await getSystemById(idSanitized);
        if (!systemFound) throw new Error('El sistema no existe.');
        if (systemFound.error) throw new Error(systemFound.error);
        if (systemFound.deletedAt) throw new Error("El sistema ya fue eliminado.");

        const systemDeletedNewData = new System({
            systemName: `userDeleted${idSanitized}`,
            systemSecret: generatePassword(SystemConfig.SECRET_LENGTH, { allowSymbols: false }),
            systemToken: generatePassword(SystemConfig.TOKEN_LEGTH, { allowSymbols: true }),
            systemIsActive: false,
            deletedAt: Date.now(),
            deletedBy: String(idUser)
        });

        const systemDeleted = await systemsRepository.deleteSystem(idSanitized, systemDeletedNewData);

        return systemDeleted;
    } catch (error) {
        return { error: error.message };
    }
};