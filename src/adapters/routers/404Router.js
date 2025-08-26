import { Router } from "express";

export const errorRouter = Router();

errorRouter.use('/', (_, res) => {
    res.json({ error: 404 });
});