import { ZodError } from "zod";
import { loginSchema } from "../../adapters/web/validators/authValidators.js";
import { validateHashedPassword } from "../../utils/bcrypt.js";
import { createRefreshToken } from "../refreshToken/CreateRefreshToken.js";
import { getSystemBySecret } from "../systems/GetSystemBySecret.js";
import { getUserSystemLinksByUserIdAndSystemId } from "../userSystemLink/GetUserSystemLinkByUserIdAndSystemId.js";
import { getUserByEmail } from "./GetUserByEmail.js";
import { createAccessToken } from "../accessToken/CreateAccessToken.js";

export const authenticateUser = async (data) => {
    try {
        const { secret, email, password } = loginSchema.parse(data);

        const userFound = await getUserByEmail(email);
        if (!userFound || userFound.error) throw new Error("Credenciales Incorrectas");
        if (!userFound.userIsActive) throw new Error('El usuario no está activo.');

        const MAX_LOGIN_ATTEMPTS = 5;
        const LOGIN_TIMEOUT = 5; // in minutes

        const actualTime = new Date();
        if (userFound.userLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
            const timeDifference = actualTime.getTime() - userFound.userLastLoginAttempt.getTime();

            if (timeDifference < (LOGIN_TIMEOUT * 60 * 1000)) {
                const remainingTime = LOGIN_TIMEOUT * 60 - Math.floor(timeDifference / 1000);
                throw new Error(`Se ha superado el límite de intentos. Por favor, inténtelo de nuevo en ${remainingTime < 60 ? `${remainingTime} segundos` : `${Math.floor(remainingTime / 60)} minutos y ${remainingTime % 60} segundos`}`);

            } else {
                userFound.userLoginAttempts = 0;
                userFound.userLastLoginAttempt = actualTime;
                await userFound.save();
            }
        }

        userFound.userLastLoginAttempt = actualTime;
        await userFound.save();

        const isMatched = await validateHashedPassword(password, userFound.userPassword)
        if (!isMatched) {
            userFound.userLoginAttempts++;
            await userFound.save();
            throw new Error(`Credenciales Incorrectas: ${MAX_LOGIN_ATTEMPTS - userFound.userLoginAttempts} intentos restantes.`);
        } else {
            userFound.userLoginAttempts = 0;
            userFound.userLastLogin = actualTime;
            await userFound.save();
        }

        const systemFound = await getSystemBySecret(secret);
        if (!systemFound || systemFound.error) throw new Error("Credenciales Incorrectas");

        const systemLinked = await getUserSystemLinksByUserIdAndSystemId(userFound._id, systemFound._id);
        if (!systemLinked || systemLinked.error) throw new Error("No tienes acceso a este sistema.");
        if (!systemLinked.userSystemLinkIsActive) throw new Error('El usuario fue desactivado del sistema.');

        const refreshToken = await createRefreshToken({ userId: userFound._id, systemId: systemFound._id });
        if (!refreshToken || refreshToken.error) throw new Error("Error al generar el token de actualización.");

        const accessToken = createAccessToken({ userId: userFound._id, systemId: systemFound._id });
        if (!accessToken || accessToken.error) throw new Error("Error al generar el token de acceso.");

        return { refreshToken, accessToken }
    } catch (error) {
        if (error instanceof ZodError) {
            return { error: JSON.parse(error.message).map(error => error.message) };
        } else if (String(error.message).includes('[')) {
            return { error: JSON.parse(error.message).map(error => error) };
        } else {
            return { error: error.message };
        }
    }
}
