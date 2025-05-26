export class CustomError extends Error {
    constructor(message, httpErrorCode = 500, errorCode = "ERR_UNKNOWN") {
        super(message);
        this.name = this.constructor.name;
        this.httpErrorCode = httpErrorCode;
        this.errorCode = Array.isArray(errorCode) ? errorCode : [errorCode];
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            httpErrorCode: this.httpErrorCode,
            errorCode: this.errorCode,
            message: this.message
        };
    }
}
