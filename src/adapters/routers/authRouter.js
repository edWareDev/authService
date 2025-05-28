import { Router } from "express";
import { controllerLogin } from "../web/controllers/AuthController.js";


export const authRouter = Router()

// RUTAS POST LOGIN
authRouter.post('/login', controllerLogin)

// RUTAS PATCH
// authRouter.patch('/id/:Id', controllerUpdateUser)

// RUTAS DELETE
// authRouter.delete('/id/:Id', controllerDeleteUser)