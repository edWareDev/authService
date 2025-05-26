export class RequestLog {
    constructor({ requestId, userId, endpoint, method, headers, queryParams, body, ip }) {
        this.logType = 'request';
        this.requestId = requestId;
        this.timestamp = new Date();
        this.userId = userId;
        this.endpoint = endpoint;
        this.method = method;
        this.headers = headers;
        this.queryParams = queryParams;
        this.body = body;
        this.ip = ip;
    }
}