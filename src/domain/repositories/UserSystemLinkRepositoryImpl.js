import { model } from "mongoose";
import { UserSystemLinkSchema } from "../../adapters/databases/UserSystemLinkModel.js";

class UserSystemLinksRepository {
    #userSystemLinksDb;

    constructor(modelSchema) {
        this.#userSystemLinksDb = modelSchema;
    }

    async getUserSystemLinkById(id) {
        try {
            const userSystemLinkFound = await this.#userSystemLinksDb
                .findById(id)
                .populate(["userId", "systemId"])
                .lean();
            return userSystemLinkFound ? userSystemLinkFound : { error: 'No existen el vinculo' };
        } catch (error) {
            console.error(error.message);
            return ({ error: "No fue posible obtener el vinculo por id" });
        }
    }

    async getUserSystemLinksByUserIdAndSystemId(userId, systemId, populate) {
        try {
            const userSystemLinkFound = await this.#userSystemLinksDb
                .findOne({ userId, systemId })
                .populate(populate ? ["userId", "systemId"] : [])
                .lean();
            return userSystemLinkFound ? userSystemLinkFound : { error: 'El usuario no tiene acceso al sistema' };
        } catch (error) {
            console.error(error.message);
            return ({ error: "No fue posible obtener el vinculo por id de usuario e id de sistema" });
        }
    }

    async getUserSystemLinksByUserId({ page, limit, skip }, userId, populate) {
        try {
            const systems = await this.#userSystemLinksDb
                .find({ userId })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate(populate ? ["systemId"] : [])
                .lean();

            const systemsInPage = systems.length;
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
            console.error(error.message);
            return ({ error: "No fue posible obtener los vinculos por id de usuario" });
        }
    }

    async getUserSystemLinksBySystemId({ page, limit, skip }, systemId, populate) {
        try {
            const users = await this.#userSystemLinksDb
                .find({ systemId })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate(populate ? ["userId"] : [])
                .lean();

            const usersInPage = users.length;
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
            console.error(error.message);
            return ({ error: "No fue posible obtener los vinculos por id de sistema" });
        }
    }

    async createUserSystemLink(userSystemLink) {
        try {
            const newUserSystemLink = await this.#userSystemLinksDb.create(userSystemLink);
            return newUserSystemLink;
        } catch (error) {
            console.error(error.message);
            return ({ error: "No fue posible crear el vinculo" });
        }
    }

    async updateUserSystemLink(id, userSystemLink) {
        try {
            const updatedUserSystemLink = await this.#userSystemLinksDb.findByIdAndUpdate(id, userSystemLink, { new: true, runValidators: true });
            return updatedUserSystemLink;
        } catch (error) {
            console.error(error.message);
            return ({ error: "No fue posible actualizar el vinculo" });
        }
    }
}

const systemModelInstance = model('userSystemLinks', UserSystemLinkSchema);
export const userSystemLinksRepository = new UserSystemLinksRepository(systemModelInstance);