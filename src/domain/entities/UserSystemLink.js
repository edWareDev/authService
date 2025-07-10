export class UserSystemLink {
    constructor({ userId, systemId, linkIsActive }) {
        this.userId = userId;
        this.systemId = systemId;
        this.userSystemLinkIsActive = linkIsActive && true;
    }
}