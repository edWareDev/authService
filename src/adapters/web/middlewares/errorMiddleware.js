import { fetchResponse } from "../../../utils/fetchResponse.js";

export const errorMiddleware = (err, _req, res, _next) => fetchResponse(res, { statusCode: err.status || 500, message: err.message || 'Ha ocurrido un error inesperado en el servidor.' });
