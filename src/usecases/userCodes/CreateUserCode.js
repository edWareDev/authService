import { ZodError } from "zod";
import { generatePassword } from "../../utils/passwordGenerator.js";
import { createUserCodeSchema } from "../../adapters/web/validators/userCodeValidators.js";
import { UserCode } from "../../domain/entities/UserCode.js";
import { userCodesRepository } from "../../domain/repositories/UserCodeRepositoryImpl.js";
import CODE_CONFIG from "./codeConfig.json" with { type: "json" };

export const createUserCode = async (data) => {
    try {
        const { user, type, timesSent, codeHasBeenUsed, ipAddress, userAgent, expiredAt } = createUserCodeSchema.parse(data);
        const tempUserCode = new UserCode({
            user: user,
            codeValue: generatePassword(CODE_CONFIG.CODE_LENGTH, { allowSymbols: false, allowLowerCase: false }),
            codeType: type,
            codeTimesSent: timesSent || 0,
            codeHasBeenUsed: codeHasBeenUsed ? true : false,
            ipAddress: ipAddress,
            userAgent: userAgent,
            expiredAt: expiredAt || null,
        });

        const userCode = await userCodesRepository.createCode(tempUserCode);
        if (userCode.error) throw new Error(userCode.error);

        return userCode;
    } catch (e) {
        if (e instanceof ZodError) {
            return { error: JSON.parse(e.message).map(error => error.message) };
        } else if (String(e.message).includes('[')) {
            return { error: JSON.parse(e.message).map(error => error) };
        } else {
            return { error: e.message };
        }
    }
};