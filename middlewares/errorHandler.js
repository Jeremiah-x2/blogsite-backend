"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAppError = void 0;
var CustomAppError = /** @class */ (function () {
    function CustomAppError(message, statusCode) {
        this.name = "AppError";
        this.message = "An error occured";
        this.message = message;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomAppError.prototype);
    }
    return CustomAppError;
}());
exports.CustomAppError = CustomAppError;
var errorHandler = function (err, req, res, next) {
    var errStatus = err.statusCode || 500;
    var errMsg = err.message || "Something went wrong";
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });
};
exports.default = errorHandler;
