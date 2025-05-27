import { ZodError } from "zod";
import { SystemLog } from "../../domain/entities/SystemLog.js";
import { createSystemLogSchema } from "../../adapters/web/validators/logValidators.js";
import { systemLogRepository } from "../../domain/repositories/SystemLogRepositoryImpl.js";
import { SystemInfo } from "../../../config/systemInfo.js";
import { SystemConfig } from "../../../config/systemConfig.js";

const systemInfo = new SystemInfo();
const systemConfig = new SystemConfig()

export const createSystemLog = async (data) => {
    try {
        if (systemConfig._SAVE_LOGS && systemInfo._LOG_DB_STATUS) {
            const tempSystemLog = new SystemLog(createSystemLogSchema.parse(data))
            const systemLog = await systemLogRepository.createSystemLog(tempSystemLog);
            if (systemLog.error) throw new Error(systemLog.error);
        }

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