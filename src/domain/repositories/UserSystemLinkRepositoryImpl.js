import { model } from "mongoose"
import { UserSystemLinkSchema } from "../../adapters/databases/UserSystemLinkModel.js"

class UserSystemLinksRepository {
    #userSystemLinksDb

    constructor(model) {
        this.#userSystemLinksDb = model
    }

    async getUserSystemLinkById(id) {
        try {
            const userSystemLinkFound = await this.#userSystemLinksDb.findById(id).populate("userId").populate("systemId").lean()
            return userSystemLinkFound ? userSystemLinkFound : { error: 'No existen el vinculo' }
        } catch (error) {
            return ({ error: error.message })
        }
    }

    async getUserSystemLinksByUserId({ page, limit, skip }, userId) {
        try {
            const systems = await this.#userSystemLinksDb
                .find({ userId })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();

            const systemsInPage = systems.length
            const totalSystems = await this.#userSystemLinksDb.countDocuments({ userId });
            const totalPages = Math.ceil(totalSystems / limit);

            const pagination = {
                currentPage: page,
                totalPages,
                totalSystems,
                systemsInPage
            };

            return { systems, pagination };
        } catch (error) {
            return { error: "No fue posible obtener los sistemas." };
        }
    }

    async getUserSystemLinksBySystemId({ page, limit, skip }, systemId) {
        try {
            const users = await this.#userSystemLinksDb
                .find({ systemId })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();

            const usersInPage = users.length
            const totalUsers = await this.#userSystemLinksDb.countDocuments({ systemId });
            const totalPages = Math.ceil(totalUsers / limit);

            const pagination = {
                currentPage: page,
                totalPages,
                totalUsers,
                usersInPage
            };

            return { users, pagination };
        } catch (error) {
            return { error: "No fue posible obtener los usuarios." };
        }
    }

    async getUserSystemLinksByUserIdAndSystemId(userId, systemId) {
        try {
            const userSystemLinkFound = await this.#userSystemLinksDb.findOne({ userId, systemId }).populate("userId").populate("systemId").lean()
            return userSystemLinkFound ? userSystemLinkFound : { error: 'El usuario no tiene acceso al sistema' }
        } catch (error) {
            return ({ error: error.message })
        }
    }

    async createUserSystemLink(userSystemLink) {
        try {
            const newUserSystemLink = await this.#userSystemLinksDb.create(userSystemLink)
            return newUserSystemLink
        } catch (error) {
            return ({ error: error.message })
        }
    }

    async updateUserSystemLink(id, userSystemLink) {
        try {
            const updatedUserSystemLink = await this.#userSystemLinksDb.findByIdAndUpdate(id, userSystemLink, { new: true, runValidators: true })
            return updatedUserSystemLink
        } catch (error) {
            return ({ error: error.message })
        }
    }
}

const systemModelInstance = model('userSystemLinks', UserSystemLinkSchema);
export const userSystemLinksRepository = new UserSystemLinksRepository(systemModelInstance);