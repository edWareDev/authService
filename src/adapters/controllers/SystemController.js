import { createSystem } from "../../usecases/systems/CreateSystem.js";
import { deleteSystem } from "../../usecases/systems/DeleteSystem.js";
import { getSystemById } from "../../usecases/systems/GetSystemById.js";
import { getSystems } from "../../usecases/systems/GetSystems.js";
import { getUserSystemLinksByUserId } from "../../usecases/systems/GetSystemsByUserId.js";
import { updateSystem } from "../../usecases/systems/UpdateSystem.js";
import { getUserById } from "../../usecases/users/GetUserById.js";
import { CustomError } from "../../utils/CustomError.js";
import { fetchResponse } from "../../utils/fetchResponse.js";

export async function controllerGetSystems(req, res) {
    try {
        const allSystems = await getSystems(req.query)
        if (allSystems.error) throw new CustomError('Error al obtener los sistemas.', 404, allSystems.error);
        fetchResponse(res, { statusCode: 200, message: 'Datos obtenidos correctamente.', data: allSystems });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}

export async function controllerGetSystemById(req, res) {
    try {
        const systemFound = await getSystemById(req.params.Id);
        if (systemFound.error) throw new CustomError('Hubo un error al encontrar el sistema.', 404, systemFound.error);
        fetchResponse(res, { statusCode: 200, message: 'Sistema encontrado correctamente.', errorCode: null, data: systemFound });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}

export async function controllerGetSystemsByUserId(req, res) {
    try {
        const userFound = await getUserById(req.params.Id);
        if (userFound.error) throw new CustomError('Hubo un error al encontrar el usuario.', 404, userFound.error);

        const populate = (String(req.query?.populate).trim() === 'true' ? true : false);
        const systemsFound = await getUserSystemLinksByUserId(req.query, userFound._id, populate)
        if (systemsFound.error) throw new CustomError('Error al obtener los usuarios.', 404, systemsFound.error);

        fetchResponse(res, { statusCode: 200, message: 'Sistemas encontrados correctamente.', errorCode: null, data: systemsFound });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}

export async function controllerCreateSystem(req, res) {
    try {
        const newSystem = await createSystem(req.body)
        if (newSystem.error) throw new CustomError('Error al crear el sistema', 400, newSystem.error);
        fetchResponse(res, { statusCode: 201, message: 'Sistema creado correctamente.', errorCode: null, data: newSystem });
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

export async function controllerUpdateSystem(req, res) {
    try {
        const systemUpdated = await updateSystem(req.body, req.params.Id);
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

export async function controllerDeleteSystem(req, res) {
    try {
        const systemVirtualDeleted = await deleteSystem(req.params.Id, req.user._id);
        if (systemVirtualDeleted.error) throw new CustomError('Hubo un error al eliminar el sistema.', 400, systemVirtualDeleted.error);
        fetchResponse(res, { statusCode: 200, message: 'Sistema eliminado correctamente.', errorCode: null });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: error.message });
        }
    }
}