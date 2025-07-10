import { isValidObjectId } from "mongoose";
import { getUserSystemLinkById } from "./GetUserSystemLinkById.js";
import { userSystemLinksRepository } from "../../domain/repositories/UserSystemLinkRepository.js";
import { UserSystemLink } from "../../domain/entities/UserSystemLink.js";
import { updateUserSystemLinkSchema } from "../../adapters/web/validators/userSystemLinkValidators.js";

const isValidStatus = (value) => {
    if (typeof value === "boolean") return true;
    if (typeof value === "string") {
        const lowerStr = value.toLowerCase();
        return lowerStr === 'true' || lowerStr === 'false';
    }
    return false;
};

export const UpdateUserSystemLinkStatus = async (id, status) => {
    try {
        const idSanitized = String(id).trim();
        if (!isValidObjectId(idSanitized)) throw new Error("El id ingresado no es válido.");

        if (!isValidStatus(status)) throw new Error("El estado ingresado no es válido.");
        const statusBoolean = typeof status === "boolean" ? status : (status.toLowerCase() === 'true');

        const linkFound = await getUserSystemLinkById(idSanitized)
        if (!linkFound) throw new Error('El vínculo no existe.');
        if (linkFound.error) throw new Error(linkFound.error);
        if (linkFound.deletedAt) throw new Error("El vínculo fue eliminado.");

        const { user, system, isActive } = updateUserSystemLinkSchema.parse({ user: idSanitized, system: idSanitized, isActive: statusBoolean })

        const userSystemLinkNewData = new UserSystemLink({
            userId: user,
            systemId: system,
            userSystemLinkIsActive: isActive
        })

        const linkUpdated = await userSystemLinksRepository.updateUserSystemLink(idSanitized, userSystemLinkNewData);

        return linkUpdated;
    } catch (error) {
        return { error: error.message };
    }
}