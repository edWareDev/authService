import { Sequelize } from "sequelize";
import { SystemInfo } from "./systemInfo.js";
import { createSystemLog } from "../src/usecases/logs/CreateSystemLog.js";

const SQLITE_CNX_STR = process.env.SQLITE_CNX_STR || './data/logs.sqlite';
const systemInfo = new SystemInfo();

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: SQLITE_CNX_STR,
    logging: false,
});

export async function connectSQLite() {
    try {
        await sequelize.authenticate();

        await import("../src/adapters/databases/SystemLogModel.js");
        await import("../src/adapters/databases/RequestLogModel.js");
        await import("../src/adapters/databases/ResponseLogModel.js");

        await sequelize.sync(); // Usar { alter: true } par amodificar db sin afectar datos
        systemInfo.setLogDbStatus(true);

        const MESSAGE = 'Base de Datos de registros Conectada';
        console.log(MESSAGE);
        if (systemInfo._LOG_DB_STATUS) {
            await createSystemLog({
                errorCode: null,
                message: MESSAGE,
                severityLevel: "info"
            })
        }
    } catch (error) {
        console.error("No se pudo conectar a SQLite:", error);
        systemInfo.setLogDbStatus(false);
    }
}
