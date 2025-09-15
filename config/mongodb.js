import mongoose from "mongoose";

import { createSystemLog } from "../src/usecases/logs/CreateSystemLog.js";
import { SystemInfo } from "./systemInfo.js";

const MONGODB_CNX_STR = process.env.MONGODB_CNX_STR;
const systemInfo = new SystemInfo();
let listenersHasBeenActive = false;

export async function connectMongoDB() {
    try {
        const MESSAGE = 'Iniciando conexión con la base de datos...';
        console.log(MESSAGE);

        // Configurar opciones de conexión
        const options = {
            retryWrites: true,
            serverSelectionTimeoutMS: 5000, // Tiempo máximo de espera para seleccionar un servidor
            socketTimeoutMS: 45000, // Tiempo máximo de espera para operaciones de socket
        };

        if (!listenersHasBeenActive) {
            // Manejar eventos de conexión y desconexión
            mongoose.connection.on('connected', async () => {
                const MESSAGE = `Base de Datos Conectada`;
                systemInfo.setDbStatus(true);
                await createSystemLog({
                    errorCode: null,
                    message: MESSAGE,
                    severityLevel: "info"
                });

                console.log(MESSAGE);
                return;
            });

            mongoose.connection.on('error', async () => {
                const MESSAGE = `Error en la conexión a la base de datos`;
                systemInfo.setDbStatus(false);
                await createSystemLog({
                    errorCode: null,
                    message: MESSAGE,
                    severityLevel: "error"
                });
                console.error(MESSAGE);
                return;
            });

            mongoose.connection.on('disconnected', async () => {
                const MESSAGE = 'Desconectado de la base de datos';
                systemInfo.setDbStatus(false);
                await createSystemLog({
                    errorCode: null,
                    message: MESSAGE,
                    severityLevel: "info"
                });
                console.error(MESSAGE);
                return;
            });
            listenersHasBeenActive = true;
        }

        // Intentar conectar
        await mongoose.connect(MONGODB_CNX_STR, options);
    } catch (error) {
        const MESSAGE = 'Error al conectar con la base de datos';
        systemInfo.setDbStatus(false);
        await createSystemLog({
            errorCode: null,
            message: MESSAGE,
            severityLevel: "error"
        });
        console.error(MESSAGE, error);

        // // Reintento con un intervalo de espera
        // await new Promise(resolve => setTimeout(resolve, 5000));
        // await connectMongoDB();
    }
}

export async function disconnectMongoDB() {
    mongoose.connection.close();
}