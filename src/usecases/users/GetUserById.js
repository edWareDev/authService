import { isValidObjectId } from "mongoose";
import { usersRepository } from "../../domain/repositories/UserRepositoryImpl.js";

export const getUserById = async (id) => {
    try {
        const sanitizedId = String(id).trim()
        if (!isValidObjectId(sanitizedId)) throw new Error('El id ingresado no es válido.');

        const userFound = await usersRepository.getUserById(sanitizedId);
        if (userFound.error) throw new Error(userFound.error);

        return userFound;
    } catch (error) {
        return { error: error.message };
    }
}