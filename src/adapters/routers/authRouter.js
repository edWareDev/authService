import { Router } from "express";
import { controllerGetPlaylist, controllerValidateToken } from "../controllers/AuthController.js";
import { validateSubscriberLogin } from "../../usecases/subscribers/ValidateSubscriber.js";
import { getCategories } from "../../usecases/categories/GetCategories.js";

// import { controllerGetAllBenefitsOfClient, controllerLogin, controllerValidateCoupon } from "../controllers/AuthController.js";
// import { validateBearerToken } from "../web/middlewares/validationMiddleware.js";


export const authRouter = Router()

authRouter.get('/:user/:password', async (req, res) => {
    try {
        const subscriberIdentifier = String(req.params.user).trim();
        const subscriberPassword = String(req.params.password).trim();
        if (subscriberIdentifier === '') throw new Error('Usuario incorrecto')
        if (subscriberPassword === '') throw new Error('Contraseña incorrecta')
        const subscriberInfo = await validateSubscriberLogin(subscriberIdentifier, subscriberPassword)
        if (subscriberInfo.error) throw new Error(subscriberInfo.error)
        res.setHeader('Content-Type', 'application/json');
        res.json({ subscriberName: subscriberInfo.subscriberIdentifier, subscriberStatus: subscriberInfo.subscriberIsActive, subscriberDisabledReason: subscriberInfo.subscriberDisabledReason })
    } catch (error) {
        console.error(error.message);
        res.status(200).json({ error: error.message })
    }
})

authRouter.get('/:user/:password/categories', async (req, res) => {
    try {
        const allCategories = await getCategories({ page: "1", limit: "1000" })
        const categoriesToResponse = allCategories?.categories.map((category) => {
            return {
                categoryId: category._id,
                categoryName: category.categoryName,
            }
        }) || []
        res.setHeader('Content-Type', 'application/json');
        res.json(categoriesToResponse)
    } catch (error) {
        console.error(error.message);
        res.status(200).json({ error: error.message })
    }

})

authRouter.get('/:subscriberIdentifier/:subscriberPassword/playlist/:responseFormat/:videoFormat', controllerGetPlaylist)
authRouter.get('/token-validate', controllerValidateToken)
// authRouter.get('/token-validate', async (req, res) => {
//     try {
//         const sessionInfo = req.query;
//         console.log(" ~ controllerValidateToken ~ sessionInfo:", sessionInfo)
//         const token = req.query.token
//         if (!token) throw new Error('Token no válido')
//         res.setHeader('X-AuthDuration', "30");
//         res.setHeader('X-UserId', "Desconocido");
//         res.status(200).json({ message: 'Token is ok' });
//     } catch (error) {
//         console.error(error.message);
//         res.status(200).json({ error: error.message })
//     }
// }



// authRouter.get('/benefits/:clientDni/:clientIdentifier', controllerGetAllBenefitsOfClient)
// authRouter.get('/validate', validateBearerToken, controllerValidateCoupon)