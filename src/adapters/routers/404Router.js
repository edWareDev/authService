import { Router } from "express";

export const errorRouter = Router()

errorRouter.use('/', (req, res) => {
    console.error('INVALID ENDPOINT');
    console.error(req.originalUrl);
    res.json({ error: 404 });
})