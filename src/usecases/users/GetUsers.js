import { usersRepository } from "../../domain/repositories/UserRepositoryImpl.js";
import { ZodError } from "zod";
import { paginationSchema } from '../../adapters/web/validators/queryParams.js';

export const getUsers = async (queryParams) => {
    try {
        const { page, limit } = paginationSchema.parse(queryParams);
        const skip = (page - 1) * limit;
        const allUsers = await usersRepository.getUsers({ page, limit, skip });
        return allUsers;
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