import { loginSchema } from "../../adapters/web/validators/authValidators.js";
import { validateHashedPassword } from "../../utils/bcrypt.js";
import { CustomError } from "../../utils/CustomError.js";
import { createRefreshToken } from "../refreshToken/CreateRefreshToken.js";
import { getSystemBySecret } from "../systems/GetSystemBySecret.js";
import { getUserSystemLinksByUserIdAndSystemId } from "../userSystemLink/GetUserSystemLinkByUserIdAndSystemId.js";
import { getUserByEmail } from "./GetUserByEmail.js";

export const authenticateUser = async (data) => {
    try {
        const { secret, email, password } = loginSchema.parse(data);
        const userFound = await getUserByEmail(email);
        if (!userFound || userFound.error) throw new CustomError('No fue posible iniciar sesión', 400, [userFound?.error | "Credenciales Incorrectas"]);
        if (!userFound.userIsActive) throw new CustomError('No fue posible iniciar sesión', 401, ['El usuario no está activo.']);

        const isMatched = validateHashedPassword(password, userFound.userPassword)
        if (!isMatched) throw new CustomError('No fue posible iniciar sesión', 400, ['Credenciales Incorrectas']);

        const systemFound = await getSystemBySecret(secret);
        if (!systemFound || systemFound.error) throw new CustomError('No fue posible iniciar sesión', 400, [systemFound?.error | "Credenciales Incorrectas"]);

        const systemLinked = getUserSystemLinksByUserIdAndSystemId(userFound._id, systemFound._id);
        if (!systemLinked || systemLinked.error) throw new CustomError('No fue posible iniciar sesión', 400, [systemLinked?.error | "Sin acceso al sistema."]);
        if (!systemLinked.userSystemLinkIsActive) throw new CustomError('No fue posible iniciar sesión', 401, ['El usuario no está activo en el sistema.']);

        const newRefreshToken = createRefreshToken({ userId: userFound._id, systemId: systemFound._id });

        return {
            newRefreshToken
        }

    } catch (error) {
        return { error: error.message };
    }
}