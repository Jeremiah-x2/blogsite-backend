"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var BlogSchema = new mongoose_1.Schema({
    authorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    authorName: String,
    title: {
        type: String,
        required: [true, "Please provide a title for you blog"],
    },
    content: { type: String, required: [true, "Provide content for your blog"] },
    createdAt: { type: Date },
    likes: { type: [mongoose_1.default.Schema.Types.ObjectId], ref: "User" },
    comments: { type: Number },
    tags: [String],
});
var Blog = (0, mongoose_1.model)("Blog", BlogSchema);
exports.default = Blog;
