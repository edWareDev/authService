import { isValidObjectId } from "mongoose";
import { getUserSystemLinkById } from "./GetUserSystemLinkById.js";
import { userSystemLinksRepository } from "../../domain/repositories/UserSystemLinkRepositoryImpl.js";

export const changeStatusUserSystemLink = async (id, status) => {
    try {
        const idSanitized = String(id).trim();
        if (!isValidObjectId(idSanitized)) throw new Error("El id ingresado no es válido.");
        const linkFound = await getUserSystemLinkById(idSanitized)
        if (!linkFound) throw new Error('El sistema no existe.');
        if (linkFound.error) throw new Error(linkFound.error);
        if (linkFound.deletedAt) throw new Error("El sistema ya fue eliminado.");

        const userSystemLinkNewData = {
            userId: linkFound.userId,
            systemId: linkFound.systemId,
            linkIsActive: status,
        }

        const systemDeleted = await userSystemLinksRepository.updateUserSystemLink(idSanitized, userSystemLinkNewData);

        return systemDeleted;
    } catch (error) {
        return { error: error.message };
    }
}