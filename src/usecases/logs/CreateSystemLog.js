import { ZodError } from "zod";
import { SystemLog } from "../../domain/entities/SystemLog.js";
import { createSystemLogSchema } from "../../adapters/web/validators/logValidators.js";
import { systemLogRepository } from "../../domain/repositories/SystemLogRepositoryImpl.js";

export const createSystemLog = async (data) => {
    try {
        createSystemLogSchema.parse(data)
        const tempSystemLog = new SystemLog(data)
        const systemLog = await systemLogRepository.createSystemLog(tempSystemLog);
        if (systemLog.error) throw new Error(systemLog.error);

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