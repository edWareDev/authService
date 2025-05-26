import { Router } from "express";
import { controllerCreateUser, controllerDeleteUser, controllerGetUserById, controllerGetUsers, controllerUpdateUser } from "../controllers/UserController.js";
import { validatePermissions } from "../../middlewares/validateUserRole.js";

export const usersRouter = Router();

// RUTAS GET
usersRouter.get('/', validatePermissions(["administrator", "contentManager", "monitor"], ["reader", "writter"]), controllerGetUsers)
usersRouter.get('/id/:Id', validatePermissions(["administrator", "contentManager", "monitor"], ["reader", "writter"]), controllerGetUserById)

// RUTAS POST
usersRouter.post('/', validatePermissions(["administrator"], ["writter"]), controllerCreateUser)

// RUTAS PATCH
usersRouter.patch('/id/:Id', validatePermissions(["administrator"], ["writter"]), controllerUpdateUser)

// RUTAS DELETE
usersRouter.delete('/id/:Id', validatePermissions(["administrator"], ["writter"]), controllerDeleteUser)