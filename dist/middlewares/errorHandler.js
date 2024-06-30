"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAppError = void 0;
class CustomAppError {
    constructor(message, statusCode) {
        this.name = "AppError";
        this.message = "An error occured";
        this.message = message;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomAppError.prototype);
    }
}
exports.CustomAppError = CustomAppError;
const errorHandler = (err, req, res, next) => {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || "Something went wrong";
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });
};
exports.default = errorHandler;
