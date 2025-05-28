import { loginSchema } from "../../adapters/web/validators/authValidators.js";
import { validateHashedPassword } from "../../utils/bcrypt.js";
import { CustomError } from "../../utils/CustomError.js";
import { createRefreshToken } from "../refreshToken/CreateRefreshToken.js";
import { getUserByEmail } from "./GetUserByEmail.js";

export const authenticateUser = async (data) => {
    try {
        const { email, password } = loginSchema.parse(data);
        const userFound = await getUserByEmail(email);
        if (!userFound || userFound.error) throw new CustomError('No fue posible iniciar sesión', 400, [userFound?.error | "Credenciales Incorrectas"]);
        if (!userFound.userIsActive) throw new CustomError('No fue posible iniciar sesión', 401, ['El usuario no está activo.']);

        const isMatched = validateHashedPassword(password, userFound.userPassword)
        if (!isMatched) throw new CustomError('No fue posible iniciar sesión', 400, ['Credenciales Incorrectas']);

        const newRefreshToken = createRefreshToken();

        return {
            newRefreshToken
        }

    } catch (error) {
        return { error: error.message };
    }
}