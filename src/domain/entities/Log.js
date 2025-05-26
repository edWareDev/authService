export class Log {
    constructor({ logId, type, token, endpoint, method, data, ip, statusCode, message, errorCode }) {
        this.logId = logId
        this.type = type
        this.token = token
        this.endpoint = endpoint
        this.method = method
        this.data = data
        this.ip = ip
        this.statusCode = statusCode
        this.message = message
        this.errorCode = errorCode
    }
}