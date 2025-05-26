import { usersRepository } from "../../domain/repositories/UserRepositoryImpl.js";

export const getUserByToken = async (token) => {
    try {
        const sanitizedToken = String(token).trim()
        if (!sanitizedToken || sanitizedToken.length !== 40) throw new Error('El token ingresado no es válido.');

        const userFound = await usersRepository.getUserByToken(sanitizedToken);
        if (userFound.error) throw new Error(userFound.error);

        return userFound;
    } catch (error) {
        return { error: error.message };
    }
}