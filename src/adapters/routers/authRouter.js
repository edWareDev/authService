import { Router } from "express";
import { controllerLogin, controllerLogout } from "../web/controllers/AuthController.js";


export const authRouter = Router()

// RUTAS POST LOGIN
authRouter.post('/login', controllerLogin)

// RUTAS POST LOGIN
authRouter.delete('/logout', controllerLogout)
// RUTAS PATCH
// authRouter.patch('/id/:Id', controllerUpdateUser)

// RUTAS DELETE
// authRouter.delete('/id/:Id', controllerDeleteUser)