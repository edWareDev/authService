import { usersRepository } from "../../domain/repositories/UserRepositoryImpl.js";
import { User } from '../../domain/entities/User.js';
import { getUserById } from "./GetUserById.js";
import { generatePassword } from "../../utils/passwordGenerator.js";
import { isValidObjectId } from "mongoose";
import { hashPassword } from "../../utils/bcrypt.js";

export const deleteUser = async (id, idUser) => {
    try {
        const idSanitized = String(id).trim();
        if (!isValidObjectId(idSanitized)) throw new Error("El id ingresado no es válido.");
        const userFound = await getUserById(idSanitized)
        if (!userFound) throw new Error('El usuario no existe.');
        if (userFound.error) throw new Error(userFound.error);
        if (userFound.deletedAt) throw new Error("El usuario ya fue eliminado.");

        const userDeletedNewData = new User({
            userName: `userDeleted${idSanitized}`,
            userEmail: `emailDeleted${idSanitized}`,
            userPassword: await hashPassword(generatePassword(10)),
            userRole: userFound.userRole,
            userIsActive: false,
            deletedAt: Date.now(),
            deletedBy: String(idUser)
        })

        const userDeleted = await usersRepository.deleteUser(idSanitized, userDeletedNewData);

        return userDeleted;
    } catch (error) {
        return { error: error.message };
    }
}