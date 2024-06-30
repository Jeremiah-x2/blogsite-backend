"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var commentController_1 = require("../controllers/commentController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var router = express_1.default.Router();
router.post("/:blog", authMiddleware_1.protect, commentController_1.create_comment);
router.get("/:blogId", commentController_1.get_blog_comments);
exports.default = router;
