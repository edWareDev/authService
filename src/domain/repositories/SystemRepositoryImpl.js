import { model } from "mongoose"
import { SystemSchema } from "../../adapters/databases/SystemModel.js";

class SystemsRepository {
    #systemsDb

    constructor(model) {
        this.#systemsDb = model
    }

    async getSystems({ page, limit, skip }) {
        try {
            const systems = await this.#systemsDb
                .find({ deletedAt: null })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();

            const systemsInPage = systems.length
            const totalSystems = await this.#systemsDb.countDocuments({ deletedAt: null });
            const totalPages = Math.ceil(totalSystems / limit);

            const pagination = {
                currentPage: page,
                totalPages,
                totalSystems,
                systemsInPage,
            };

            return { systems, pagination };
        } catch (error) {
            return { error: "No fue posible obtener los usuarios." };
        }
    }

    async getSystemById(id) {
        try {
            const systemFound = await this.#systemsDb.findById(id).lean()
            return systemFound ? systemFound : { error: 'No existe el sistema con ese id.' }
        } catch (error) {
            return ({ error: error.message })
        }
    }

    async getSystemBySecret(secret) {
        try {
            const systemFound = await this.#systemsDb.findOne({ systemSecret: secret }).lean()
            return systemFound ? systemFound : { error: 'No existe el sistema con ese secret.' }
        } catch (error) {
            return ({ error: error.message })
        }
    }

    async createSystem(system) {
        try {
            const newSystem = await this.#systemsDb.create(system)
            return newSystem
        } catch (error) {
            return ({ error: error.message })
        }
    }

    async updateSystem(id, system) {
        try {
            const updatedSystem = await this.#systemsDb.findByIdAndUpdate(id, system, { new: true, runValidators: true })
            return updatedSystem
        } catch (error) {
            return ({ error: error.message })
        }
    }

    async deleteSystem(id, systemDeletedNewData) {
        try {
            const deletedUser = await this.#systemsDb.findByIdAndUpdate(id, systemDeletedNewData, { new: true })
            return deletedUser
        } catch (error) {
            return ({ error: error.message })
        }
    }
}

const systemModelInstance = model('systems', SystemSchema);
export const systemsRepository = new SystemsRepository(systemModelInstance);