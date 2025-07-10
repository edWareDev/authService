import { SystemLog } from "../../adapters/databases/SystemLogModel.js";

class SystemLogRepository {
    #systemLogDb

    constructor() {
        this.#systemLogDb = SystemLog;
    }

    async getSystemLogs({ page, limit, skip }) {
        try {
            const offset = skip || (page - 1) * limit;

            // Obtenemos los logs con paginación y orden descendente por timestamp
            const { rows: systemLogs, count: totalSystemLogs } = await this.#systemLogDb.findAndCountAll({
                order: [["timestamp", "DESC"]],
                limit,
                offset,
            });

            const systemLogsInPage = systemLogs.length;
            const totalPages = Math.ceil(totalSystemLogs / limit);

            return {
                systemLogs,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalSystemLogs: totalSystemLogs,
                    systemLogsInPage: systemLogsInPage,
                },
            };
        } catch (error) {
            console.error(error.message)
            return { error: "No fue posible obtener los app logs" };
        }
    }

    async createSystemLog(log) {
        try {
            return await this.#systemLogDb.create(log);
        } catch (error) {
            console.error(error.message)
            return { error: "No fue posible crear el log de sistema" };
        }
    }
}

export const systemLogRepository = new SystemLogRepository();