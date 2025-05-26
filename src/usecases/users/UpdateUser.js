import { usersRepository } from "../../domain/repositories/UserRepositoryImpl.js";
import { User } from '../../domain/entities/User.js';
import { getUserById } from "./GetUserById.js";
import { hashPassword } from "../../utils/bcrypt.js";
import { updateUserSchema } from "../../adapters/web/validators/userValidators.js";
import { ZodError } from "zod";
import { isValidObjectId } from "mongoose";

export const updateUser = async (data, id) => {
    try {
        const sanitizedId = String(id).trim()
        if (!isValidObjectId(sanitizedId)) throw new Error('El id ingresado no es válido.');

        const userFound = await getUserById(sanitizedId)
        if (!userFound) throw new Error('El usuario no existe.');
        if (userFound.error) throw new Error(userFound.error);

        const { name, email, password, role, isActive } = updateUserSchema.parse(data)
        const userNewData = new User({
            userName: (typeof name !== 'undefined') ? String(name).trim() : userFound.userName,
            userEmail: (typeof email !== 'undefined') ? String(email).trim() : userFound.userEmail,
            userPassword: (typeof password !== 'undefined') ? await hashPassword(password) : userFound.userPassword,
            userRole: (typeof role !== 'undefined') ? String(role).trim().toLowerCase() : userFound.userRole,
            userIsActive: (typeof isActive !== 'undefined') ? isActive : userFound.userIsActive,
        })

        const user = await usersRepository.updateUser(sanitizedId, userNewData);

        return user;
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