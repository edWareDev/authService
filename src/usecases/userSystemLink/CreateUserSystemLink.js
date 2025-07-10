import { ZodError } from "zod";
import { userSystemLinksRepository } from "../../domain/repositories/UserSystemLinkRepositoryImpl.js";
import { UserSystemLink } from "../../domain/entities/UserSystemLink.js";
import { createUserSystemLinkSchema } from "../../adapters/web/validators/userSystemLinkValidators.js";


export const createUserSystemLink = async (data) => {
    try {
        const { user, system, isActive } = createUserSystemLinkSchema.parse(data)

        const tempUserSystemLink = new UserSystemLink({
            userId: user,
            systemId: system,
            userSystemLinkIsActive: isActive
        })

        const userSystemLink = await userSystemLinksRepository.createUserSystemLink(tempUserSystemLink);

        if (userSystemLink.error) throw new Error(userSystemLink.error);

        return userSystemLink;
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