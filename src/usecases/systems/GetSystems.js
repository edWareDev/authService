import { ZodError } from "zod";
import { paginationSchema } from '../../adapters/web/validators/queryParams.js';
import { systemsRepository } from "../../domain/repositories/SystemRepositoryImpl.js";

export const getSystems = async (queryParams) => {
    try {
        const { page, limit } = paginationSchema.parse(queryParams)
        const skip = (page - 1) * limit;
        const allSystems = await systemsRepository.getSystems({ page, limit, skip });
        return allSystems;
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