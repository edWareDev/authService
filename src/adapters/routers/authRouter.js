import { Router } from "express";
import { controllerLogin, controllerLogout, controllerRefreshAccessToken } from "../web/controllers/AuthController.js";


export const authRouter = Router();

// RUTAS POST 
// LOGIN
authRouter.post('/login', controllerLogin);

// REFRESH TOKEN
authRouter.post('/validateAccessToken', controllerRefreshAccessToken);

// REFRESH TOKEN
authRouter.post('/refreshAccessToken', controllerRefreshAccessToken);

// RUTAS DELETE
// LOGOUT
authRouter.delete('/logout', controllerLogout);