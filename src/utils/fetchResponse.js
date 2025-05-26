export const fetchResponse = (res, { statusCode = 200, message = null, errorCode = null, data = null }) => {
    const responseBody = {
        statusCode,
        message,
        ...(errorCode && { errorCode }),
        ...(data && { data })
    };

    res.status(statusCode).json(responseBody);
};