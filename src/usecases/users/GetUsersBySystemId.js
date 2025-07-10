import { isValidObjectId } from "mongoose";
import { userSystemLinksRepository } from "../../domain/repositories/UserSystemLinkRepositoryImpl.js";
import { paginationSchema } from "../../adapters/web/validators/queryParams.js";

export const getUserSystemLinksBySystemId = async (queryParams, systemId) => {
    try {
        const { page, limit } = paginationSchema.parse(queryParams)
        const skip = (page - 1) * limit;

        const sanitizedId = String(systemId).trim()
        if (!isValidObjectId(sanitizedId)) throw new Error('El id ingresado no es válido.');

        const allLinksFound = await userSystemLinksRepository.getUserSystemLinksBySystemId({ page, limit, skip }, sanitizedId);
        if (allLinksFound.error) throw new Error(allLinksFound.error);

        return allLinksFound;
    } catch (error) {
        return { error: error.message };
    }
}