import { model } from "mongoose"
import { RefreshTokenSchema } from "../../adapters/databases/RefreshTokenModel.js"

class RefreshTokensRepository {
    #refreshTokensDb

    constructor(model) {
        this.#refreshTokensDb = model
    }

    async getRefreshTokenByValue(tokenValue) {
        try {
            const refreshTokenFound = await this.#refreshTokensDb.findOne({ tokenValue: tokenValue }).lean()
            return refreshTokenFound ? refreshTokenFound : { error: 'No existe el refresh token con ese value.' }
        } catch (error) {
            return ({ error: error.message })
        }
    }

    async createRefreshToken(data) {
        try {
            const newRefreshToken = await this.#refreshTokensDb.create(data)
            return newRefreshToken
        } catch (error) {
            return ({ error: error.message })
        }
    }

    async updateRefreshToken(id, refreshTokanData) {
        try {
            const updatedRefreshToken = await this.#refreshTokensDb.findByIdAndUpdate(id, refreshTokanData, { new: true, runValidators: true })
            return updatedRefreshToken
        } catch (error) {
            return ({ error: error.message })
        }
    }
}

const refreshTokenModelInstance = model('refreshTokens', RefreshTokenSchema);
export const refreshTokensRepository = new RefreshTokensRepository(refreshTokenModelInstance);