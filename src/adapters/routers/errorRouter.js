import { Router } from "express";
import { HTTP_CODES } from "../../utils/http_error_codes.js";

export const errorRouter = Router();

errorRouter.use('/', (_, res) => {
    res.status(HTTP_CODES._404_NOT_FOUND).json({ error: "Endpoint not found" });
});