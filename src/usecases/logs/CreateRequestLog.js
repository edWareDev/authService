import { ZodError } from "zod";
import { createRequestLogSchema } from "../../adapters/web/validators/logValidators.js";
import { RequestLog } from "../../domain/entities/RequestLog.js";
import { requestLogsRepository } from "../../domain/repositories/RequestLogRepositoryImpl.js";
import { SystemInfo } from "../../../config/systemInfo.js";
import { SystemConfig } from "../../../config/systemConfig.js";

const systemInfo = new SystemInfo();
const systemConfig = new SystemConfig()

export const createRequestLog = async (data) => {
    try {
        if (systemConfig._SAVE_LOGS && systemInfo._LOG_DB_STATUS) {
            const tempRequestLog = new RequestLog(createRequestLogSchema.parse(data))
            const requestLog = await requestLogsRepository.createRequestLog(tempRequestLog);
            if (requestLog.error) throw new Error(requestLog.error);
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