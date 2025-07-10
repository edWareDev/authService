import { UpdateUserSystemLinkStatus } from "../../usecases/userSystemLink/UpdateUserSystemLinkStatus.js";
import { createUserSystemLink } from "../../usecases/userSystemLink/CreateUserSystemLink.js";
import { getUserSystemLinkById } from "../../usecases/userSystemLink/GetUserSystemLinkById.js";
import { getUserSystemLinksByUserIdAndSystemId } from "../../usecases/userSystemLink/GetUserSystemLinkByUserIdAndSystemId.js";
import { CustomError } from "../../utils/CustomError.js";
import { fetchResponse } from "../../utils/fetchResponse.js";

export async function controllerGetUserSystemLinkById(req, res) {
    try {
        const userSystemLinkFound = await getUserSystemLinkById(req.params.Id);
        if (userSystemLinkFound.error) throw new CustomError('Hubo un error al encontrar el vínculo.', 404, userSystemLinkFound.error);
        fetchResponse(res, { statusCode: 200, message: 'Vínculo encontrado correctamente.', errorCode: null, data: userSystemLinkFound });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}

export async function controllerGetUserSystemLinkByUserIdAndSystemId(req, res) {
    try {
        const populate = (String(req.query?.populate).trim() === 'true' ? true : false);
        const userSystemLinkFound = await getUserSystemLinksByUserIdAndSystemId(req.params.UserId, req.params.SystemId, populate);
        if (userSystemLinkFound.error) throw new CustomError('Hubo un error al encontrar el vínculo.', 404, userSystemLinkFound.error);
        fetchResponse(res, { statusCode: 200, message: 'Vínculo encontrado correctamente.', errorCode: null, data: userSystemLinkFound });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}

export async function controllerCreateUserSystemLink(req, res) {
    try {
        const newUserSystemLink = await createUserSystemLink(req.body)
        if (newUserSystemLink.error) throw new CustomError('Error al crear el vínculo', 400, newUserSystemLink.error);
        fetchResponse(res, { statusCode: 201, message: 'Vínculo creado correctamente.', errorCode: null, data: newUserSystemLink });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            if (String(errorCode).includes('duplicate')) {
                fetchResponse(res, { statusCode: httpErrorCode, message, errorCode: "El nombre del sistema ya está en uso." });
            } else {
                fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
            }
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}

export async function controllerUpdateUserSystemLinkStatus(req, res) {
    try {
        const systemUpdated = await UpdateUserSystemLinkStatus(req.params.Id, req.body?.isActive);
        if (systemUpdated.error) throw new CustomError('Error al actualizar el sistema.', 400, systemUpdated.error);
        fetchResponse(res, { statusCode: 201, message: 'Sistema actualizado correctamente.', errorCode: null, data: systemUpdated });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            if (String(errorCode).includes('duplicate')) {
                fetchResponse(res, { statusCode: httpErrorCode, message, errorCode: "El nombre del sistema ya está en uso." });
            } else {
                fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
            }
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}