"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
require("../strategies/githubStrategy");
const router = express_1.default.Router();
router.post("/", userController_1.create_user);
router.post("/login", userController_1.login_user);
router.patch("/confirm/:usertoken", userController_1.confirm_email);
router.post("/logout", authMiddleware_1.protect, userController_1.logout_user);
exports.default = router;
