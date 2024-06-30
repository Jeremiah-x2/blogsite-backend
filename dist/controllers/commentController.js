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
exports.get_blog_comments = exports.create_comment = void 0;
const blogModel_1 = __importDefault(require("../models/blogModel"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const errorHandler_1 = require("../middlewares/errorHandler");
const create_comment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const author = req.user;
        const authorName = req.author;
        const { content } = req.body;
        const { blog } = req.params;
        console.log(req.body);
        if (!author) {
            throw new errorHandler_1.CustomAppError("Login before you can comment", 401);
        }
        if (content === "") {
            throw new errorHandler_1.CustomAppError("Content cannont be empty", 400);
        }
        else {
            const newComment = yield commentModel_1.default.create({
                author,
                authorName,
                blog,
                content,
                date: new Date(),
            });
            if (newComment) {
                const updateBlogComment = yield blogModel_1.default.updateOne({ _id: blog }, { $inc: { comments: 1 } }, { new: true });
            }
            res.status(201).json({ comment: newComment });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.create_comment = create_comment;
const get_blog_comments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.params;
    console.log(blogId);
    const comments = yield commentModel_1.default.find({ blog: blogId });
    console.log(comments);
    res.status(200).json({ comments });
});
exports.get_blog_comments = get_blog_comments;
