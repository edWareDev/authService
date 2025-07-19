import { Router } from "express";
import { usersRouter } from "./usersRouter.js";
import { SystemInfo } from "../../../config/systemInfo.js";
import { systemsRouter } from "./systemsRouter.js";
import { userSystemLinksRouter } from "./linksRouter.js";

const systemInfo = new SystemInfo();

export const apiRouter = Router();
systemInfo.setApiStatus(true);

apiRouter.use('/users', usersRouter);
apiRouter.use('/systems', systemsRouter);
apiRouter.use('/links', userSystemLinksRouter);
// apiRouter.use('/logs', logsRouter)