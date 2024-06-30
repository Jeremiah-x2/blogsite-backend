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
exports.logout_user = exports.confirm_email = exports.login_user = exports.create_user = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const errorHandler_1 = require("../middlewares/errorHandler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const cloudinary_1 = require("cloudinary");
const create_user = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    cloudinary_1.v2.config({
        cloud_name: "dxkviv7wu",
        api_key: "981812317659488",
        api_secret: "4jzJsLS6NiedS0fJP0zgy_668iY",
    });
    try {
        const { image, email, password, username } = req.body;
        if (email && password) {
            const isUserExist = yield userModel_1.default.findOne({ email });
            if (isUserExist) {
                throw new errorHandler_1.CustomAppError("User already exists", 409);
            }
            // const hashedPassword = await bcrypt.hash(password, 10);
            const uploadResult = yield cloudinary_1.v2.uploader
                .upload(image, {
                public_id: `${email.split("@")[0]}_${username}`,
            })
                .catch((error) => {
                console.log("Error", error);
                throw new Error(`Hello world ${error}`);
            });
            // @ts-ignore
            console.log("Uploaded image", uploadResult.url);
            const newUser = yield userModel_1.default.create({
                // @ts-ignore
                userAvatar: uploadResult.url,
                email,
                password,
                name: username,
            });
            const token = generateToken(newUser._id);
            // const cookie = `token=${token}; samesite=none; secure, max-age=3600000; path=/`;
            // res.setHeader("set-cookie", cookie);
            console.log(newUser);
            res.json({
                user: newUser,
                confirmationRoute: `${process.env.ACCESS_ORIGIN}/users/confirm/${token}`,
                uploadResult,
            });
        }
        else {
            throw new errorHandler_1.CustomAppError("Email and Password required", 500);
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.create_user = create_user;
const login_user = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const userExist = yield userModel_1.default.findOne({ email });
        if (!userExist) {
            throw new errorHandler_1.CustomAppError("Email does not exist", 404);
        }
        const checkPassword = yield bcrypt_1.default.compare(password, userExist.password);
        if (checkPassword) {
            if (!userExist.isAccountActive) {
                throw new errorHandler_1.CustomAppError("Please, activate the account before you can login", 401);
            }
            const token = generateToken(userExist._id);
            const cookie = `token=${token}; samesite=none; secure; max-age=3600000; path=/`;
            res.setHeader("set-cookie", [
                cookie,
                `user=${userExist._id}; samesite=none; secure; max-age=3600000; path=/`,
            ]);
            res.status(201).json({ user: userExist });
        }
        else {
            throw new errorHandler_1.CustomAppError("Passwords do not match", 401);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.login_user = login_user;
const confirm_email = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usertoken } = req.params;
        const verifyToken = (0, jsonwebtoken_1.verify)(usertoken, "hello");
        if (typeof jsonwebtoken_1.verify === "string") {
            throw new Error("Invalid token");
        }
        const findUser = yield userModel_1.default.findById(verifyToken.id);
        if (!findUser) {
            throw new Error("Link probably been tampered with");
        }
        const confirmUser = yield userModel_1.default.findOneAndUpdate({ _id: verifyToken.id }, {
            isAccountActive: true,
        }, { new: true });
        const token = generateToken(findUser._id);
        const cookie = `token=${token}; samesite=none; secure, max-age=3600000; path=/`;
        res.setHeader("set-cookie", cookie);
        res
            .status(200)
            .json({ token: verifyToken.id, user: findUser });
    }
    catch (error) {
        next(error);
    }
});
exports.confirm_email = confirm_email;
const logout_user = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const cookie = `token=hello; samesite=none; secure, max-age=100000; path=/`;
    res.setHeader("set-cookie", cookie);
    res.status(201).json({ message: "User logged out" });
});
exports.logout_user = logout_user;
//TOKEN GENETATION FUNCTION
const generateToken = (id) => {
    return (0, jsonwebtoken_1.sign)({ id }, process.env.JWT_KEY);
};
