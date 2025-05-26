import { Router } from "express";
import { usersRouter } from "./usersRouter.js";
import { SystemInfo } from "../../../config/systemInfo.js";

const systemInfo = new SystemInfo();

export const apiRouter = Router()
systemInfo.setApiStatus(true)

apiRouter.use('/users', usersRouter)
// apiRouter.use('/logs', logsRouter)