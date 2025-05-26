import { CustomError } from "../../utils/CustomError.js";
import { fetchResponse } from "../../utils/fetchResponse.js";
import { getAllLogs } from "../../usecases/logs/GetAllLogs.js";

export async function controllerGetAllLogs(req, res) {
    try {
        const allLogs = await getAllLogs()
        if (allLogs.error) throw new CustomError('Error al obtener los logs.', 404, allLogs.error);
        fetchResponse(res, { statusCode: 200, message: 'Datos obtenidos correctamente.', errorCode: null, data: allLogs });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}