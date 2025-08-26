import { isValidObjectId } from "mongoose";
import { paginationSchema } from "../../adapters/web/validators/queryParams.js";
import { userSystemLinksRepository } from "../../domain/repositories/UserSystemLinkRepositoryImpl.js";

export const getUserSystemLinksByUserId = async (queryParams, userId, populate) => {
    try {
        const { page, limit } = paginationSchema.parse(queryParams);
        const skip = (page - 1) * limit;

        const sanitizedId = String(userId).trim();
        if (!isValidObjectId(sanitizedId)) throw new Error('El id ingresado no es válido.');

        const allLinksFound = await userSystemLinksRepository.getUserSystemLinksByUserId({ page, limit, skip }, sanitizedId, populate);
        if (allLinksFound.error) throw new Error(allLinksFound.error);


        return allLinksFound;
    } catch (error) {
        return { error: error.message };
    }
};