import { logsRepository } from "../../domain/repositories/LogRepositoryImpl.js";

export const getAllLogs = async () => {
    try {
        const allLogs = await logsRepository.getAllLogs();
        return allLogs;
    } catch (error) {
        return { error: error.message };
    }
}