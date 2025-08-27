export class System {
    constructor({ systemName, systemSecret, systemToken, systemIsActive, systemLastAccess, deletedAt, deletedBy }) {
        this.systemName = systemName;
        this.systemSecret = systemSecret;
        this.systemToken = systemToken;
        this.systemIsActive = systemIsActive && true;
        this.systemLastAccess = systemLastAccess || null;
        this.deletedAt = deletedAt || null;
        this.deletedBy = deletedBy || null;
    }
}