export class UserCode {
    constructor({ user, codeValue, codeType, codeTimesSent, codeHasBeenUsed, ipAddress, userAgent, expiredAt }) {
        this.user = user;
        this.codeValue = codeValue;
        this.codeType = codeType;
        this.codeTimesSent = codeTimesSent || 1;
        this.codeHasBeenUsed = codeHasBeenUsed ? true : false;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.expiredAt = expiredAt || null;
    }
}