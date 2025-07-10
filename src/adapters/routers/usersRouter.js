import { Router } from "express";
import { controllerCreateUser, controllerDeleteUser, controllerGetUserById, controllerGetUsers, controllerGetUsersBySystemId, controllerUpdateUser } from "../controllers/UserController.js";
import { validatePermissions } from "../../middlewares/validateUserRole.js";

export const usersRouter = Router();

// RUTAS GET
usersRouter.get('/', validatePermissions(["administrator", "user"]), controllerGetUsers)
usersRouter.get('/id/:Id', validatePermissions(["administrator", "user"]), controllerGetUserById)
usersRouter.get('/system/:Id', validatePermissions(["administrator", "user"]), controllerGetUsersBySystemId)

// RUTAS POST
usersRouter.post('/', validatePermissions(["administrator"]), controllerCreateUser)

// RUTAS PATCH
usersRouter.patch('/id/:Id', validatePermissions(["administrator"]), controllerUpdateUser)

// RUTAS DELETE
usersRouter.delete('/id/:Id', validatePermissions(["administrator"]), controllerDeleteUser)