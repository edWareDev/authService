
export const routeNotFoundMiddleware = (req, _res, next) => {
    const error = new Error(`Endpoint no encontrado: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
}