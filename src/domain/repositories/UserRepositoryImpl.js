import { model } from "mongoose"
import { UserSchema } from './../../adapters/databases/UserModel.js';

class UsersRepository {
    #usersDb

    constructor(userModel) {
        this.#usersDb = userModel
    }

    async getUsers({ page, limit, skip }) {
        try {
            const users = await this.#usersDb
                .find({ deletedAt: null })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();

            const usersInPage = users.length
            const totalUsers = await this.#usersDb.countDocuments({ deletedAt: null });
            const totalPages = Math.ceil(totalUsers / limit);

            const pagination = {
                currentPage: page,
                totalPages,
                totalUsers,
                usersInPage,
            };

            return { users, pagination };
        } catch (error) {
            return { error: "No fue posible obtener los usuarios." };
        }
    }

    async getUserById(id) {
        try {
            const userFound = await this.#usersDb.findById(id).lean()
            return userFound ? userFound : { error: 'No existe el usuario con ese id.' }
        } catch (error) {
            return ({ error: error.message })
        }
    }

    async getUserByEmail(userEmail) {
        try {
            const userFound = await this.#usersDb.findOne({ userEmail })
            return userFound ? userFound : { error: 'No existe el usuario con ese token.' }
        } catch (error) {
            return ({ error: error.message })
        }
    }

    async createUser(user) {
        try {
            const newUser = await this.#usersDb.create(user)
            return newUser
        } catch (error) {
            return ({ error: error.message })
        }
    }

    async updateUser(id, user) {
        try {
            const updatedUser = await this.#usersDb.findByIdAndUpdate(id, user, { new: true, runValidators: true })
            return updatedUser
        } catch (error) {
            return ({ error: error.message })
        }
    }

    async deleteUser(id, userDeletedNewData) {
        try {
            const deletedUser = await this.#usersDb.findByIdAndUpdate(id, userDeletedNewData, { new: true })
            return deletedUser
        } catch (error) {
            return ({ error: error.message })
        }
    }
}

const userModelInstance = model('users', UserSchema);
export const usersRepository = new UsersRepository(userModelInstance);