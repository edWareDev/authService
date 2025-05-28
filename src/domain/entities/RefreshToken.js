export class RefreshToken {
    constructor({ userId, systemId, tokenValue, tokenIsActive, expirationDate }) {
        this.userId = userId;
        this.systemId = systemId;
        this.tokenValue = tokenValue;
        this.tokenIsActive = tokenIsActive;
        this.expirationDate = expirationDate;
    }
}