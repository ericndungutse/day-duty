import AppError from "./../utils/AppError.js"

const handleJWTError = () =>
    new AppError("Invalid login session. Please log in again!", 401);

const handleJWTExpiredError = () =>
    new AppError("Your login session has expired! Please log in again.", 401);

const handleDuplicateError = (err) => {
    const message = `${String(Object.keys(err.keyValue)).toUpperCase()} ${Object.values(
        err.keyValue
    )} is taken. Try a different ${Object.keys(err.keyValue)}`;

    return new AppError(message, 400);
};

const handleValidationError = (err) => {
    const message = Object.values(err.errors).map(
        ({ properties: { path, message } }) => {
            return JSON.stringify({
                field: path,
                message,
            });
        }
    );

    err.statusCode = 400;

    return new AppError(message, err.statusCode);
};

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: "${err.value}".`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (error, err, res) => {
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    } else {
        console.log("Error", err);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
};

const globalErrHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") return sendErrorDev(err, res);

    if (
        process.env.NODE_ENV.trim() === "production" ||
        process.env.NODE_ENV.trim() === "test"
    ) {
        let error = { ...err, message: err.message };

        if (err.name === "CastError") error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateError(error);
        if (err.name === "ValidationError") error = handleValidationError(error);
        if (err.name === "JsonWebTokenError") error = handleJWTError(error);
        if (err.name === "TokenExpiredError") error = handleJWTExpiredError(error);

        return sendErrorProd(error, err, res);
    }
};

export default globalErrHandler