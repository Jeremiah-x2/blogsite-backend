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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout_user = exports.confirm_email = exports.login_user = exports.create_user = void 0;
var userModel_1 = require("../models/userModel");
var errorHandler_1 = require("../middlewares/errorHandler");
var bcrypt_1 = require("bcrypt");
var jsonwebtoken_1 = require("jsonwebtoken");
var cloudinary_1 = require("cloudinary");
var create_user = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, image, email, password, username, isUserExist, uploadResult, newUser, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cloudinary_1.v2.config({
                    cloud_name: "dxkviv7wu",
                    api_key: "981812317659488",
                    api_secret: "4jzJsLS6NiedS0fJP0zgy_668iY",
                });
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                _a = req.body, image = _a.image, email = _a.email, password = _a.password, username = _a.username;
                if (!(email && password)) return [3 /*break*/, 5];
                return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
            case 2:
                isUserExist = _b.sent();
                if (isUserExist) {
                    throw new errorHandler_1.CustomAppError("User already exists", 409);
                }
                return [4 /*yield*/, cloudinary_1.v2.uploader
                        .upload(image, {
                        public_id: "".concat(email.split("@")[0], "_").concat(username),
                    })
                        .catch(function (error) {
                        console.log("Error", error);
                        throw new Error("Hello world ".concat(error));
                    })];
            case 3:
                uploadResult = _b.sent();
                // @ts-ignore
                console.log("Uploaded image", uploadResult.url);
                return [4 /*yield*/, userModel_1.default.create({
                        // @ts-ignore
                        userAvatar: uploadResult.url,
                        email: email,
                        password: password,
                        name: username,
                    })];
            case 4:
                newUser = _b.sent();
                token = generateToken(newUser._id);
                // const cookie = `token=${token}; samesite=none; secure, max-age=3600000; path=/`;
                // res.setHeader("set-cookie", cookie);
                console.log(newUser);
                res.json({
                    user: newUser,
                    confirmationRoute: "".concat(process.env.ACCESS_ORIGIN, "/users/confirm/").concat(token),
                    uploadResult: uploadResult,
                });
                return [3 /*break*/, 6];
            case 5: throw new errorHandler_1.CustomAppError("Email and Password required", 500);
            case 6: return [3 /*break*/, 8];
            case 7:
                error_1 = _b.sent();
                console.log(error_1);
                next(error_1);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.create_user = create_user;
var login_user = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, userExist, checkPassword, token, cookie, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
            case 2:
                userExist = _b.sent();
                if (!userExist) {
                    throw new errorHandler_1.CustomAppError("Email does not exist", 404);
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, userExist.password)];
            case 3:
                checkPassword = _b.sent();
                if (checkPassword) {
                    if (!userExist.isAccountActive) {
                        throw new errorHandler_1.CustomAppError("Please, activate the account before you can login", 401);
                    }
                    token = generateToken(userExist._id);
                    cookie = "token=".concat(token, "; samesite=none; secure; max-age=3600000; path=/");
                    res.setHeader("set-cookie", [
                        cookie,
                        "user=".concat(userExist._id, "; samesite=none; secure; max-age=3600000; path=/"),
                    ]);
                    res.status(201).json({ user: userExist });
                }
                else {
                    throw new errorHandler_1.CustomAppError("Passwords do not match", 401);
                }
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.login_user = login_user;
var confirm_email = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var usertoken, verifyToken, findUser, confirmUser, token, cookie, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                usertoken = req.params.usertoken;
                verifyToken = (0, jsonwebtoken_1.verify)(usertoken, "hello");
                if (typeof jsonwebtoken_1.verify === "string") {
                    throw new Error("Invalid token");
                }
                return [4 /*yield*/, userModel_1.default.findById(verifyToken.id)];
            case 1:
                findUser = _a.sent();
                if (!findUser) {
                    throw new Error("Link probably been tampered with");
                }
                return [4 /*yield*/, userModel_1.default.findOneAndUpdate({ _id: verifyToken.id }, {
                        isAccountActive: true,
                    }, { new: true })];
            case 2:
                confirmUser = _a.sent();
                token = generateToken(findUser._id);
                cookie = "token=".concat(token, "; samesite=none; secure, max-age=3600000; path=/");
                res.setHeader("set-cookie", cookie);
                res
                    .status(200)
                    .json({ token: verifyToken.id, user: findUser });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.confirm_email = confirm_email;
var logout_user = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, cookie;
    return __generator(this, function (_a) {
        user = req.user;
        cookie = "token=hello; samesite=none; secure, max-age=100000; path=/";
        res.setHeader("set-cookie", cookie);
        res.status(201).json({ message: "User logged out" });
        return [2 /*return*/];
    });
}); };
exports.logout_user = logout_user;
//TOKEN GENETATION FUNCTION
var generateToken = function (id) {
    return (0, jsonwebtoken_1.sign)({ id: id }, process.env.JWT_KEY);
};
