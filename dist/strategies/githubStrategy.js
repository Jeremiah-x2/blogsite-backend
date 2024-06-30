"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = require("passport-github2");
exports.default = passport_1.default.use(new passport_github2_1.Strategy({
    clientID: "Ov23lidI0lmaifX48hT2",
    clientSecret: "5c0aea297ac216455dbc67287d153f0d2024f7f1",
    callbackURL: `http://localhost:8000/user/gitoauth/callback`,
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
}));
