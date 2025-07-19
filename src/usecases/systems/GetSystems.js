import { ZodError } from "zod";
import { paginationSchema } from '../../adapters/web/validators/queryParams.js';
import { systemsRepository } from "../../domain/repositories/SystemRepositoryImpl.js";

export const getSystems = async (queryParams) => {
    try {
        const { page, limit } = paginationSchema.parse(queryParams);
        const skip = (page - 1) * limit;
        const allSystems = await systemsRepository.getSystems({ page, limit, skip });
        return allSystems;
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