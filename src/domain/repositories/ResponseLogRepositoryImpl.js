import { ResponseLog } from "../../adapters/databases/ResponseLogModel.js";

class ResponseLogRepository {
    #responseLogsDb

    constructor() {
        this.#responseLogsDb = ResponseLog;
    }

    async getResponseLogs({ page, limit, skip }) {
        try {
            const offset = skip || (page - 1) * limit;

            const { rows: responseLogs, count: totalResponseLogs } = await this.#responseLogsDb.findAndCountAll({
                order: [["timestamp", "DESC"]],
                limit,
                offset,
            });

            const responseLogsInPage = responseLogs.length;
            const totalPages = Math.ceil(totalResponseLogs / limit);

            return {
                responseLogs,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalResponseLogs,
                    responseLogsInPage,
                }
            };
        } catch (error) {
            console.error(error.message);
            return { error: "No fue posible obtener los response logs" };
        }
    }

    async getResponseLogByRequestId(id) {
        try {
            const responseLogFound = await this.#responseLogsDb.findOne({
                where: { requestId: id }
            });
            if (!responseLogFound) throw new Error("No existe el response con ese ID.");
            return responseLogFound;
        } catch (error) {
            console.error(error.message);
            return { error: "No fue posible obtener el response log por request id" };
        }
    }

    async createResponseLog(log) {
        try {
            return await this.#responseLogsDb.create(log);
        } catch (error) {
            console.error(error.message);
            return { error: "No fue posible crear el response log" };

        }
    }
}

export const responseLogsRepository = new ResponseLogRepository();
