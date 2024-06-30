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
const mongoose_1 = require("mongoose");
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    userAvatar: String,
    email: {
        type: String,
        required: [true, "Enter your email address"],
        validate: [isEmail_1.default, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Create a password"],
        minlength: [6, "The password should be a minimum of 6 characters"],
    },
    name: { type: String, required: [true, "Please, provide a name"] },
    isAccountActive: Boolean,
}, {
    timestamps: true,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = bcrypt_1.default.hashSync(this.password, 10);
        this.isAccountActive = false;
        next();
    });
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
