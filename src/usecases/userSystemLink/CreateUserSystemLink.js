import { ZodError } from "zod";
import { userSystemLinksRepository } from "../../domain/repositories/UserSystemLinkRepositoryImpl.js";
import { UserSystemLink } from "../../domain/entities/UserSystemLink.js";


export const createUserSystemLink = async ({ userId, systemId, linkIsActive }) => {
    try {

        const tempUserSystemLink = new UserSystemLink({
            userId,
            systemId,
            linkIsActive
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