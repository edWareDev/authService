import { Router } from "express";
// import { systemsRouter } from "./systemsRouter.js";
// import { userSystemLinksRouter } from "./linksRouter.js";
import { usersInternalRouter } from "./usersInternalRouter.js";


export const apiInternalRouter = Router();

apiInternalRouter.use('/users', usersInternalRouter);
// apiInternalRouter.use('/systems', systemsRouter);
// apiInternalRouter.use('/links', userSystemLinksRouter);