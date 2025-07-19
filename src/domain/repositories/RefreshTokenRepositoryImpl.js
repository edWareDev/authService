import { model } from "mongoose";
import { RefreshTokenSchema } from "../../adapters/databases/RefreshTokenModel.js";

class RefreshTokensRepository {
    #refreshTokensDb;

    constructor(modelSchema) {
        this.#refreshTokensDb = modelSchema;
    }

    async getRefreshTokenByValue(tokenValue) {
        try {
            const refreshTokenFound = await this.#refreshTokensDb.findOne({ tokenValue: tokenValue }).lean();
            return refreshTokenFound ? refreshTokenFound : { error: 'No existe el refresh token con ese value.' };
        } catch (error) {
            console.error(error.message);
            return ({ error: "No fue posible obtener el refresh token." });
        }
    }

    async createRefreshToken(data) {
        try {
            const newRefreshToken = await this.#refreshTokensDb.create(data);
            return newRefreshToken;
        } catch (error) {
            console.error(error.message);
            return { error: "No fue posible crear el refresh token." };
        }
    }

    async updateRefreshToken(id, refreshTokanData) {
        try {
            const updatedRefreshToken = await this.#refreshTokensDb.findByIdAndUpdate(id, refreshTokanData, { new: true, runValidators: true });
            return updatedRefreshToken;
        } catch (error) {
            console.error(error.message);
            return { error: "No fue posible actualizar el refresh token." };
        }
    }
}

const refreshTokenModelInstance = model('refreshTokens', RefreshTokenSchema);
export const refreshTokensRepository = new RefreshTokensRepository(refreshTokenModelInstance);