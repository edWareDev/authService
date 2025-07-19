import { isValidObjectId } from "mongoose";
import { userSystemLinksRepository } from "../../domain/repositories/UserSystemLinkRepositoryImpl.js";

export const getUserSystemLinkById = async (id) => {
    try {
        const sanitizedId = String(id).trim();
        if (!isValidObjectId(sanitizedId)) throw new Error('El id ingresado no es válido.');

        const linkFound = await userSystemLinksRepository.getUserSystemLinkById(sanitizedId);
        if (linkFound.error) throw new Error(linkFound.error);

        return linkFound;
    } catch (e) {
        return { error: e.message };
    }
};