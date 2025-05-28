import { ZodError } from "zod";
import { usersRepository } from "../../domain/repositories/UserRepositoryImpl.js";
import { hashPassword } from "../../utils/bcrypt.js";
import { User } from './../../domain/entities/User.js';
import { createUserSchema } from "../../adapters/web/validators/userValidators.js";
import { generatePassword } from "../../utils/passwordGenerator.js";


export const createUser = async (data) => {
    try {
        const { name, dni, email, password, role, isActive } = createUserSchema.parse(data)
        const tempUser = new User({
            userName: name,
            userDni: dni,
            userEmail: email,
            userPassword: await hashPassword(password),
            userToken: generatePassword(40),
            userRole: role,
            userIsActive: isActive,
        })

        const user = await usersRepository.createUser(tempUser);

        if (user.error) throw new Error(user.error);

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