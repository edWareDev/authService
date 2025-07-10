import { Router } from "express";
import { validatePermissions } from "../../middlewares/validateUserRole.js";
import { controllerCreateUserSystemLink, controllerGetUserSystemLinkById, controllerGetUserSystemLinkByUserIdAndSystemId, controllerUpdateUserSystemLinkStatus } from "../controllers/LinkController.js";

export const userSystemLinksRouter = Router();

// RUTAS GET
userSystemLinksRouter.get('/id/:Id', validatePermissions(["administrator"]), controllerGetUserSystemLinkById)
userSystemLinksRouter.get('/user/:UserId/system/:SystemId', validatePermissions(["administrator"]), controllerGetUserSystemLinkByUserIdAndSystemId)

// RUTAS POST
userSystemLinksRouter.post('/', validatePermissions(["administrator"]), controllerCreateUserSystemLink)

// RUTAS PATCH
userSystemLinksRouter.patch('/id/:Id', validatePermissions(["administrator"]), controllerUpdateUserSystemLinkStatus)
