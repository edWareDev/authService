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
            console.error(error.message)
            return { error: "No fue posible obtener los usuarios." };
        }
    }

    async getSystemById(id) {
        try {
            const systemFound = await this.#systemsDb.findById(id).lean()
            return systemFound ? systemFound : { error: 'No existe el sistema con ese id.' }
        } catch (error) {
            console.error(error.message)
            return ({ error: "No fue posible obtener el sistema por id." })
        }
    }

    async getSystemBySecret(secret) {
        try {
            const systemFound = await this.#systemsDb.findOne({ systemSecret: secret }).lean()
            return systemFound ? systemFound : { error: 'No existe el sistema con ese secret.' }
        } catch (error) {
            console.error(error.message)
            return ({ error: "No fue posible obtener el sistema por secret." })
        }
    }

    async createSystem(system) {
        try {
            const newSystem = await this.#systemsDb.create(system)
            return newSystem
        } catch (error) {
            console.error(error.message)
            return ({ error: "Error al crear el sistema." })
        }
    }


    async updateSystem(id, system) {
        try {
            const updatedSystem = await this.#systemsDb.findByIdAndUpdate(id, system, { new: true, runValidators: true })
            return updatedSystem
        } catch (error) {
            console.error(error.message)
            return ({ error: "Error al actualizar el sistema." })
        }
    }

    async deleteSystem(id, systemDeletedNewData) {
        try {
            const deletedUser = await this.#systemsDb.findByIdAndUpdate(id, systemDeletedNewData, { new: true })
            return deletedUser
        } catch (error) {
            console.error(error.message)
            return ({ error: "Error al eliminar el sistema." })
        }
    }
}

const systemModelInstance = model('systems', SystemSchema);
export const systemsRepository = new SystemsRepository(systemModelInstance);