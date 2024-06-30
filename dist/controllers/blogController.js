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
exports.get_blog_by_id = exports.like_blog = exports.delete_blog = exports.get_all_blogs = exports.update_blog = exports.create_blog = void 0;
const blogModel_1 = __importDefault(require("../models/blogModel"));
const errorHandler_1 = require("../middlewares/errorHandler");
const create_blog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const author = req.user;
    const authorName = req.author;
    console.log(author);
    const { title, content } = req.body;
    try {
        if (!author) {
            throw new errorHandler_1.CustomAppError("You can't create a blog because you are not signed in", 401);
        }
        if (!title || !content) {
            throw new errorHandler_1.CustomAppError("Both title and content for the blog must be provided", 500);
        }
        const newBlog = yield blogModel_1.default.create({
            authorId: author,
            title,
            authorName,
            content,
            createdAt: new Date(),
            tags: ["TODO"],
        });
        return res.status(201).json({ blog: newBlog });
    }
    catch (error) {
        next(error);
    }
});
exports.create_blog = create_blog;
const update_blog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const author = req.user;
    const { blogId } = req.params;
    try {
        const blog = yield blogModel_1.default.findById(blogId);
        if (blog && blog.authorId.toString() === author._id.toString()) {
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            const updatedBlog = yield blogModel_1.default.updateOne({ _id: blogId }, { $set: updateOps }, { new: true });
            return res.status(201).json({ updatedBlog });
        }
        if (!blog) {
            throw new errorHandler_1.CustomAppError("Blog not found", 404);
        }
        if (blog.authorId !== author) {
            throw new errorHandler_1.CustomAppError("User does not have permission to modify this blog", 401);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.update_blog = update_blog;
const get_all_blogs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBlogs = yield blogModel_1.default.find();
        return res.status(200).json({ blogs: allBlogs });
    }
    catch (error) {
        next(error);
    }
});
exports.get_all_blogs = get_all_blogs;
const delete_blog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const author = req.user;
        const { blogId } = req.params;
        const isBlogExist = yield blogModel_1.default.findById(blogId);
        console.log(author, isBlogExist);
        if (isBlogExist && author === isBlogExist.authorId.toString()) {
            const deleteBlog = yield blogModel_1.default.findByIdAndDelete(blogId);
            return res.status(201).json({ blog: deleteBlog });
        }
        if (!isBlogExist) {
            throw new errorHandler_1.CustomAppError("Blog does not exist", 404);
        }
        if (author !== isBlogExist._id) {
            throw new errorHandler_1.CustomAppError("User can't delete this blog", 401);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.delete_blog = delete_blog;
const like_blog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Liking a blog", req.params.blogId);
    try {
        const user = req.user;
        const { blogId } = req.params;
        const blog = yield blogModel_1.default.findById(blogId);
        if (!blogId) {
            throw new errorHandler_1.CustomAppError("Blog not found", 404);
        }
        if (blog === null || blog === void 0 ? void 0 : blog.likes.includes(user)) {
            const unlikeBlog = yield blogModel_1.default.updateOne({ _id: blogId }, { $pull: { likes: user } }, { new: true });
            return res.status(201).json({ blog: unlikeBlog });
        }
        const likeBlog = yield blogModel_1.default.updateOne({ _id: blogId }, { $push: { likes: user } }, { new: true });
        return res.status(201).json({ blog: likeBlog });
    }
    catch (error) {
        next(error);
    }
});
exports.like_blog = like_blog;
const get_blog_by_id = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { blogId } = req.params;
        const isBlogExist = yield blogModel_1.default.findById(blogId);
        if (!isBlogExist) {
            throw new errorHandler_1.CustomAppError("Blog does not exits", 404);
        }
        res.status(200).json({ blog: isBlogExist });
    }
    catch (error) { }
});
exports.get_blog_by_id = get_blog_by_id;
