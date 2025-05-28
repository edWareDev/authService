export class RefreshTokenPayload {
    constructor({ emisor, userId, systemId, expirationDate, creationDate }) {
        this.iss = emisor;
        this.sub = userId;
        this.aud = systemId;
        this.exp = expirationDate;
        this.iat = creationDate;
    }
}