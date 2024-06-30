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
exports.get_blog_by_id = exports.like_blog = exports.delete_blog = exports.get_all_blogs = exports.update_blog = exports.create_blog = void 0;
var blogModel_1 = require("../models/blogModel");
var errorHandler_1 = require("../middlewares/errorHandler");
var create_blog = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var author, authorName, _a, title, content, newBlog, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                author = req.user;
                authorName = req.author;
                console.log(author);
                _a = req.body, title = _a.title, content = _a.content;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                if (!author) {
                    throw new errorHandler_1.CustomAppError("You can't create a blog because you are not signed in", 401);
                }
                if (!title || !content) {
                    throw new errorHandler_1.CustomAppError("Both title and content for the blog must be provided", 500);
                }
                return [4 /*yield*/, blogModel_1.default.create({
                        authorId: author,
                        title: title,
                        authorName: authorName,
                        content: content,
                        createdAt: new Date(),
                        tags: ["TODO"],
                    })];
            case 2:
                newBlog = _b.sent();
                return [2 /*return*/, res.status(201).json({ blog: newBlog })];
            case 3:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.create_blog = create_blog;
var update_blog = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var author, blogId, blog, updateOps, _i, _a, ops, updatedBlog, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                author = req.user;
                blogId = req.params.blogId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, blogModel_1.default.findById(blogId)];
            case 2:
                blog = _b.sent();
                if (!(blog && blog.authorId.toString() === author._id.toString())) return [3 /*break*/, 4];
                updateOps = {};
                for (_i = 0, _a = req.body; _i < _a.length; _i++) {
                    ops = _a[_i];
                    updateOps[ops.propName] = ops.value;
                }
                return [4 /*yield*/, blogModel_1.default.updateOne({ _id: blogId }, { $set: updateOps }, { new: true })];
            case 3:
                updatedBlog = _b.sent();
                return [2 /*return*/, res.status(201).json({ updatedBlog: updatedBlog })];
            case 4:
                if (!blog) {
                    throw new errorHandler_1.CustomAppError("Blog not found", 404);
                }
                if (blog.authorId !== author) {
                    throw new errorHandler_1.CustomAppError("User does not have permission to modify this blog", 401);
                }
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.update_blog = update_blog;
var get_all_blogs = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var allBlogs, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, blogModel_1.default.find()];
            case 1:
                allBlogs = _a.sent();
                return [2 /*return*/, res.status(200).json({ blogs: allBlogs })];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.get_all_blogs = get_all_blogs;
var delete_blog = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var author, blogId, isBlogExist, deleteBlog, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                author = req.user;
                blogId = req.params.blogId;
                return [4 /*yield*/, blogModel_1.default.findById(blogId)];
            case 1:
                isBlogExist = _a.sent();
                console.log(author, isBlogExist);
                if (!(isBlogExist && author === isBlogExist.authorId.toString())) return [3 /*break*/, 3];
                return [4 /*yield*/, blogModel_1.default.findByIdAndDelete(blogId)];
            case 2:
                deleteBlog = _a.sent();
                return [2 /*return*/, res.status(201).json({ blog: deleteBlog })];
            case 3:
                if (!isBlogExist) {
                    throw new errorHandler_1.CustomAppError("Blog does not exist", 404);
                }
                if (author !== isBlogExist._id) {
                    throw new errorHandler_1.CustomAppError("User can't delete this blog", 401);
                }
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.delete_blog = delete_blog;
var like_blog = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, blogId, blog, unlikeBlog, likeBlog, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Liking a blog", req.params.blogId);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                user = req.user;
                blogId = req.params.blogId;
                return [4 /*yield*/, blogModel_1.default.findById(blogId)];
            case 2:
                blog = _a.sent();
                if (!blogId) {
                    throw new errorHandler_1.CustomAppError("Blog not found", 404);
                }
                if (!(blog === null || blog === void 0 ? void 0 : blog.likes.includes(user))) return [3 /*break*/, 4];
                return [4 /*yield*/, blogModel_1.default.updateOne({ _id: blogId }, { $pull: { likes: user } }, { new: true })];
            case 3:
                unlikeBlog = _a.sent();
                return [2 /*return*/, res.status(201).json({ blog: unlikeBlog })];
            case 4: return [4 /*yield*/, blogModel_1.default.updateOne({ _id: blogId }, { $push: { likes: user } }, { new: true })];
            case 5:
                likeBlog = _a.sent();
                return [2 /*return*/, res.status(201).json({ blog: likeBlog })];
            case 6:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.like_blog = like_blog;
var get_blog_by_id = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var blogId, isBlogExist, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                blogId = req.params.blogId;
                return [4 /*yield*/, blogModel_1.default.findById(blogId)];
            case 1:
                isBlogExist = _a.sent();
                if (!isBlogExist) {
                    throw new errorHandler_1.CustomAppError("Blog does not exits", 404);
                }
                res.status(200).json({ blog: isBlogExist });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.get_blog_by_id = get_blog_by_id;
