import { Router } from "express";
import { controllerGetAllLogs } from "../controllers/LogController.js";

export const logsRouter = Router();

// RUTAS GET
logsRouter.get('/', controllerGetAllLogs)