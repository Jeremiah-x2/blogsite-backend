"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const errorHandler_1 = require("./errorHandler");
const userModel_1 = __importDefault(require("../models/userModel"));
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        console.log(token);
        if (!token) {
            throw new errorHandler_1.CustomAppError("No token provided", 401);
        }
        const verifyToken = (0, jsonwebtoken_1.verify)(token, "hello");
        const isUser = yield userModel_1.default.findById(verifyToken.id);
        if (!isUser) {
            throw new errorHandler_1.CustomAppError("User not found", 404);
        }
        req.user = isUser.id;
        req.author = isUser.name;
        next();
    }
    catch (error) {
        if (error instanceof errorHandler_1.CustomAppError) {
            next(error);
        }
        else if (error instanceof Error) {
            console.log(error);
            if (error.name === "JsonWebTokenError") {
                next(new errorHandler_1.CustomAppError("Invalid token" + error, 401));
            }
            else if (error.name === "TokenExpiredError") {
                next(new errorHandler_1.CustomAppError("Token expired" + error, 401));
            }
            else {
                next(new errorHandler_1.CustomAppError("Authentication failed" + error, 500));
            }
        }
        else {
            next(new errorHandler_1.CustomAppError("An unknown error occurred" + error, 500));
        }
    }
});
exports.protect = protect;
