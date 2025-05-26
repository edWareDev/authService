export class User {
    constructor({ userName, userEmail, userPassword, userToken, userRole, userIsActive, userLoginAttempts, deletedAt, deletedBy }) {
        this.userName = userName;
        this.userEmail = userEmail;
        this.userPassword = userPassword;
        this.userToken = userToken;
        this.userRole = userRole;
        this.userIsActive = userIsActive && true;
        this.userLoginAttempts = userLoginAttempts || 0;
        this.deletedAt = deletedAt || null;
        this.deletedBy = deletedBy || null;
    }
}