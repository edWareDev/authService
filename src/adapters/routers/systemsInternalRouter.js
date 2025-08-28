import { Router } from "express";
import { controllerCreateSystem, controllerDeleteSystem, controllerGetSystemById, controllerGetSystems, controllerGetSystemsByUserId, controllerUpdateSystem } from "../controllers/SystemController.js";

export const systemsInternalRouter = Router();

// RUTAS GET
systemsInternalRouter.get('/', controllerGetSystems);
systemsInternalRouter.get('/id/:Id', controllerGetSystemById);
systemsInternalRouter.get('/user/:Id', controllerGetSystemsByUserId);

// RUTAS POST
systemsInternalRouter.post('/', controllerCreateSystem);

// RUTAS PATCH
systemsInternalRouter.patch('/id/:Id', controllerUpdateSystem);

// RUTAS DELETE
systemsInternalRouter.delete('/id/:Id', controllerDeleteSystem);