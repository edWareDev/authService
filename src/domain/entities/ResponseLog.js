export class ResponseLog {
    constructor({ requestId, responseTime, statusCode, body, errorCode, message }) {
        this.logType = 'response';
        this.requestId = requestId;
        this.timestamp = new Date();
        this.responseTime = responseTime;
        this.body = body;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.message = message;
    }
}