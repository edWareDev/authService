export class User {
    constructor({ userName, userDni, userEmail, userPassword, userRole, userIsActive, userLoginAttempts, lastLogin, lastLoginAttempt, deletedAt, deletedBy }) {
        this.userName = userName;
        this.userDni = userDni;
        this.userEmail = userEmail;
        this.userPassword = userPassword;
        this.userRole = userRole;
        this.userIsActive = userIsActive && true;
        this.userLoginAttempts = userLoginAttempts || 0;
        this.userLastLogin = lastLogin || null;
        this.userLastLoginAttempt = lastLoginAttempt || null;
        this.deletedAt = deletedAt || null;
        this.deletedBy = deletedBy || null;
    }
}