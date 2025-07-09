import { getUsers } from "../../usecases/users/GetUsers.js";
import { CustomError } from "../../utils/CustomError.js";
import { fetchResponse } from "../../utils/fetchResponse.js";
import { createUser } from './../../usecases/users/CreateUser.js';
import { updateUser } from "../../usecases/users/UpdateUser.js";
import { getUserById } from "../../usecases/users/GetUserById.js";
import { deleteUser } from "../../usecases/users/DeleteUser.js";

export async function controllerGetUsers(req, res) {
    try {
        const allUsers = await getUsers(req.query)
        if (allUsers.error) throw new CustomError('Error al obtener los usuarios.', 404, allUsers.error);
        fetchResponse(res, { statusCode: 200, message: 'Datos obtenidos correctamente.', data: allUsers });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}

export async function controllerGetUserById(req, res) {
    try {
        const userFound = await getUserById(req.params.Id);
        if (userFound.error) throw new CustomError('Hubo un error al encontrar el usuario.', 404, userFound.error);
        fetchResponse(res, { statusCode: 200, message: 'Usuario encontrado correctamente.', errorCode: null, data: userFound });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}

export async function controllerCreateUser(req, res) {
    try {
        const newUser = await createUser(req.body)
        if (newUser.error) throw new CustomError('Error al crear el usuario', 400, newUser.error);
        fetchResponse(res, { statusCode: 201, message: 'Usuario creado correctamente.', errorCode: null, data: newUser });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            if (String(errorCode).includes('duplicate')) {
                fetchResponse(res, { statusCode: httpErrorCode, message, errorCode: "El correo electrónico o dni ya está en uso." });
            } else {
                fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
            }
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}

export async function controllerUpdateUser(req, res) {
    try {
        const userUpdated = await updateUser(req.body, req.params.Id);
        if (userUpdated.error) throw new CustomError('Error al actualizar el usuario.', 400, userUpdated.error);
        fetchResponse(res, { statusCode: 201, message: 'Usuario actualizado correctamente.', errorCode: null, data: userUpdated });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            if (String(errorCode).includes('duplicate')) {
                fetchResponse(res, { statusCode: httpErrorCode, message, errorCode: "El correo electrónico o dni ya está en uso." });
            } else {
                fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
            }
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: "Ha ocurrido un error inesperado" });
        }
    }
}

export async function controllerDeleteUser(req, res) {
    try {
        const userVirtualDeleted = await deleteUser(req.params.Id, req.user?._id || req.externalApp?._id);
        if (userVirtualDeleted.error) throw new CustomError('Hubo un error al eliminar el usuario.', 400, userVirtualDeleted.error);
        fetchResponse(res, { statusCode: 200, message: 'Usuario eliminado correctamente.', errorCode: null });
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            fetchResponse(res, { statusCode: httpErrorCode, message, errorCode });
        } else {
            fetchResponse(res, { statusCode: 500, errorCode: "ERR_UNEXPECTED", message: error.message });
        }
    }
}