"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const blogController_1 = require("../controllers/blogController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
router.post("/", authMiddleware_1.protect, blogController_1.create_blog);
router.get("/", blogController_1.get_all_blogs);
router.get("/:blogId", blogController_1.get_blog_by_id);
router.patch("/update/:blogId", authMiddleware_1.protect, blogController_1.update_blog);
router.delete("/delete/:blogId", authMiddleware_1.protect, blogController_1.delete_blog);
router.patch("/blog/like/:blogId", authMiddleware_1.protect, blogController_1.like_blog);
exports.default = router;
