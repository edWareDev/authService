export class UserSystemLink {
    constructor({ userId, systemId, linkIsActive }) {
        this.userId = userId;
        this.systemId = systemId;
        this.linkIsActive = linkIsActive && true;
    }
}