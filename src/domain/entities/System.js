export class System {
    constructor({ systemName, systemSecret, systemIsActive, systemLastAccess, deletedAt, deletedBy }) {
        this.systemName = systemName;
        this.systemSecret = systemSecret;
        this.systemIsActive = systemIsActive && true;
        this.systemLastAccess = systemLastAccess || null;
        this.deletedAt = deletedAt || null;
        this.deletedBy = deletedBy || null;
    }
}