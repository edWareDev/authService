import { Router } from "express";
import { controllerCreateSystem, controllerDeleteSystem, controllerGetSystemById, controllerGetSystems, controllerGetSystemsByUserId, controllerUpdateSystem } from "../controllers/SystemController.js";
import { validatePermissions } from "../../middlewares/validateUserRole.js";

export const systemsRouter = Router();

// RUTAS GET
systemsRouter.get('/', validatePermissions(["administrator"]), controllerGetSystems)
systemsRouter.get('/id/:Id', validatePermissions(["administrator"]), controllerGetSystemById)
systemsRouter.get('/user/:Id', validatePermissions(["administrator"]), controllerGetSystemsByUserId)

// RUTAS POST
systemsRouter.post('/', validatePermissions(["administrator"]), controllerCreateSystem)

// RUTAS PATCH
systemsRouter.patch('/id/:Id', validatePermissions(["administrator"]), controllerUpdateSystem)

// RUTAS DELETE
systemsRouter.delete('/id/:Id', validatePermissions(["administrator"]), controllerDeleteSystem)