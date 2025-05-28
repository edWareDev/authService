import { isValidObjectId } from "mongoose";
import { userSystemLinksRepository } from "../../domain/repositories/UserSystemLinkRepositoryImpl.js";

export const getUserSystemLinksByUserIdAndSystemId = async (userId, systemId) => {
    try {

        const sanitizedUserId = String(userId).trim()
        if (!isValidObjectId(sanitizedUserId)) throw new Error('El id ingresado no es válido.');

        const sanitizedSystemId = String(systemId).trim()
        if (!isValidObjectId(sanitizedSystemId)) throw new Error('El id ingresado no es válido.');

        const linkFound = await userSystemLinksRepository.getUserSystemLinksByUserIdAndSystemId(sanitizedUserId, sanitizedSystemId);
        if (linkFound.error) throw new Error(linkFound.error);

        return linkFound;
    } catch (error) {
        return { error: error.message };
    }
}