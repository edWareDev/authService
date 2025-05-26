import { RequestLog } from "../../adapters/databases/RequestLogModel.js";

class RequestLogRepository {
    #requestLogsDb

    constructor() {
        this.#requestLogsDb = RequestLog;
    }

    async getRequestLogs({ page, limit, skip }) {
        try {
            const offset = skip || (page - 1) * limit;

            const { rows: requestLogs, count: totalRequestLogs } = await this.#requestLogsDb.findAndCountAll({
                order: [["timestamp", "DESC"]],
                limit,
                offset,
            });

            const requestLogsInPage = requestLogs.length;
            const totalPages = Math.ceil(totalRequestLogs / limit);

            return {
                requestLogs,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalRequestLogs,
                    requestLogsInPage,
                }
            };
        } catch (error) {
            console.error(error.message);
            return { error: "No fue posible obtener los request logs" };
        }
    }

    async getRequestLogByRequestId(id) {
        try {
            const requestLogFound = await this.#requestLogsDb.findOne({
                where: { requestId: id }
            });
            if (!requestLogFound) throw new Error("No existe el request con ese ID.");
            return requestLogFound;
        } catch (error) {
            return { error: error.message };
        }
    }

    async createRequestLog(log) {
        try {
            return await this.#requestLogsDb.create(log);
        } catch (error) {
            return { error: error.message };
        }
    }
}

export const requestLogsRepository = new RequestLogRepository();
