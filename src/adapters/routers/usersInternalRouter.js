import { Router } from "express";
import { controllerCreateUser, controllerDeleteUser, controllerGetUserById, controllerGetUsers, controllerGetUsersBySystemId, controllerUpdateUser } from "../controllers/UserController.js";

export const usersInternalRouter = Router();

// RUTAS GET
usersInternalRouter.get('/', controllerGetUsers);
usersInternalRouter.get('/id/:Id', controllerGetUserById);
usersInternalRouter.get('/system/:Id', controllerGetUsersBySystemId);

// RUTAS POST
usersInternalRouter.post('/', controllerCreateUser);

// RUTAS PATCH
usersInternalRouter.patch('/id/:Id', controllerUpdateUser);

// RUTAS DELETE
usersInternalRouter.delete('/id/:Id', controllerDeleteUser);