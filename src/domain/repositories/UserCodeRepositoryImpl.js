import { model } from "mongoose";
import { UserCodeSchema } from "../../adapters/databases/UserCodeModel.js";

class UserCodesRepository {
    #userCodesDb;

    constructor() {
        this.#userCodesDb = model("UserCodes", UserCodeSchema);
    }

    async getCodes({ page, limit, skip }) {
        try {
            const userCodes = await this.#userCodesDb
                .find({ deletedAt: null })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();

            const codesInPage = userCodes.length;
            const totalCodes = await this.#userCodesDb.countDocuments({ deletedAt: null });
            const totalPages = Math.ceil(totalCodes / limit);

            const pagination = {
                currentPage: page,
                totalPages,
                totalCodes,
                codesInPage,
            };

            return { userCodes, pagination };
        } catch (error) {
            console.error(error.message);
            return { error: "No fue posible obtener los códigos" };
        }
    }

    async getCodeById(id) {
        try {
            const codeFound = await this.#userCodesDb.findById(id).lean();
            return codeFound ? codeFound : { error: 'No existe el código con ese id.' };
        } catch (error) {
            console.error(error.message);
            return ({ error: "No fue posible obtener el código por id" });
        }
    }

    async getCodeByUserValueTipe(user, codeValue, codeType) {
        try {
            const codeFound = await this.#userCodesDb.findOne({ user, codeValue, codeType });
            return codeFound ? codeFound : { error: 'No existe el código con ese token.' };
        } catch (error) {
            console.error(error.message);
            return ({ error: "No fue posible obtener el código" });
        }
    }

    async createCode(code) {
        try {
            const newCode = await this.#userCodesDb.create(code);
            return newCode;
        } catch (error) {
            console.error(error.message);
            return ({ error: "No fue posible crear el código" });
        }
    }

    async updateCode(id, code) {
        try {
            const updatedCode = await this.#userCodesDb.findByIdAndUpdate(id, code, { new: true, runValidators: true });
            return updatedCode;
        } catch (error) {
            console.error(error.message);
            return ({ error: "No fue posible actualizar el código" });
        }
    }
}

export const userCodesRepository = new UserCodesRepository();