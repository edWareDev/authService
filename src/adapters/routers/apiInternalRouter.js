import { Router } from "express";
import { usersInternalRouter } from "./usersInternalRouter.js";
import { systemsInternalRouter } from "./systemsInternalRouter.js";
import { userSystemLinksInternalRouter } from "./linksInternalRouter.js";


export const apiInternalRouter = Router();

apiInternalRouter.use('/users', usersInternalRouter);
apiInternalRouter.use('/systems', systemsInternalRouter);
apiInternalRouter.use('/links', userSystemLinksInternalRouter);