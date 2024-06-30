"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var commentSchema = new mongoose_1.Schema({
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    blog: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "Blog" },
    authorName: String,
    content: {
        type: String,
        required: [true, "Provide content for your comment"],
    },
    likes: [mongoose_1.default.Schema.Types.ObjectId],
}, { timestamps: true });
var Comment = (0, mongoose_1.model)("Comment", commentSchema);
exports.default = Comment;
