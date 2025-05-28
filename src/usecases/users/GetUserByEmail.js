import { usersRepository } from "../../domain/repositories/UserRepositoryImpl.js";

export const getUserByEmail = async (email) => {
    try {
        const userFound = await usersRepository.getUserByEmail(email);
        if (userFound.error) throw new Error(userFound.error);

        return userFound;
    } catch (error) {
        return { error: error.message };
    }
}