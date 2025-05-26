import { Router } from "express";
import { SystemInfo } from "../../../config/systemInfo.js";

export const healthRouter = Router()

const systemInfo = new SystemInfo();

healthRouter.get('', async (_, res) => {
    res.json(systemInfo.data)
})