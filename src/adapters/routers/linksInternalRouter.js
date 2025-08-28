import { Router } from "express";
import { controllerCreateUserSystemLink, controllerGetUserSystemLinkById, controllerGetUserSystemLinkByUserIdAndSystemId, controllerUpdateUserSystemLinkStatus } from "../controllers/LinkController.js";

export const userSystemLinksInternalRouter = Router();

// RUTAS GET
userSystemLinksInternalRouter.get('/id/:Id', controllerGetUserSystemLinkById);
userSystemLinksInternalRouter.get('/user/:UserId/system/:SystemId', controllerGetUserSystemLinkByUserIdAndSystemId);

// RUTAS POST
userSystemLinksInternalRouter.post('/', controllerCreateUserSystemLink);

// RUTAS PATCH
userSystemLinksInternalRouter.patch('/id/:Id', controllerUpdateUserSystemLinkStatus);
