import { createSystemLog } from "../src/usecases/logs/CreateSystemLog.js";

export const startServer = (app) => {

    return new Promise((resolve, reject) => {
        const PORT = process.env.API_PORT || 3000;

        const server = app.listen(PORT, async () => {
            const MESSAGE = process.env.NODE_ENV === "development"
                ? `Conectado al servidor mediante el puerto: ${PORT}`
                : 'Conectado al servidor';
            await createSystemLog({
                errorCode: null,
                message: MESSAGE,
                severityLevel: "info"
            });
            console.log(MESSAGE);
            resolve(server);
            return;
        });

        server.on('error', async (error) => {
            let errorMessage;
            let errorCodes = [];

            switch (error.code) {
                case 'EADDRINUSE':
                    errorMessage = `El puerto ${PORT} está ocupado`;
                    errorCodes = ['PORT_ALREADY_IN_USE'];
                    break;
                case 'EACCES':
                    errorMessage = `No se tienen permisos para usar el puerto ${PORT}`;
                    errorCodes = ['INSUFFICIENT_PRIVILEGES'];
                    break;
                default:
                    errorMessage = `Error al iniciar el servidor: ${error.message}`;
                    errorCodes = ['SERVER_STARTUP_ERROR'];
            }

            await createSystemLog({
                errorCode: errorCodes,
                message: errorMessage,
                severityLevel: "error"
            });

            console.error(errorMessage);
            reject(error);
            return;
        });
    });
};