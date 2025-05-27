import { ZodError } from "zod";
import { createResponseLogSchema } from "../../adapters/web/validators/logValidators.js";
import { ResponseLog } from "../../domain/entities/ResponseLog.js";
import { responseLogsRepository } from "../../domain/repositories/ResponseLogRepositoryImpl.js";
import { SystemInfo } from "../../../config/systemInfo.js";
import { SystemConfig } from "../../../config/systemConfig.js";

const systemInfo = new SystemInfo();
const systemConfig = new SystemConfig()

export const createResponseLog = async (data) => {
    try {
        if (systemConfig._SAVE_LOGS && systemInfo._LOG_DB_STATUS) {
            const tempResponseLog = new ResponseLog(createResponseLogSchema.parse(data))
            const responseLog = await responseLogsRepository.createResponseLog(tempResponseLog);
            if (responseLog.error) throw new Error(responseLog.error);
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