import { ZodError } from "zod";
import { createResponseLogSchema } from "../../adapters/web/validators/logValidators.js";
import { ResponseLog } from "../../domain/entities/ResponseLog.js";
import { responseLogsRepository } from "../../domain/repositories/ResponseLogRepositoryImpl.js";

export const createResponseLog = async (data) => {
    try {
        const tempResponseLog = new ResponseLog(createResponseLogSchema.parse(data))
        const responseLog = await responseLogsRepository.createResponseLog(tempResponseLog);
        if (responseLog.error) throw new Error(responseLog.error);

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