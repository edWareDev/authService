export class SystemLog {
    constructor({ errorCode, message, severityLevel }) {
        this.timestamp = new Date();
        this.errorCode = errorCode;
        this.message = message;
        this.severityLevel = severityLevel;
    }
}