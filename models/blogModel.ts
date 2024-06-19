import mongoose, { Schema, model, connect, mongo } from "mongoose";
import User from "./userModel";

interface IBlog {
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  title: string;
  content: string;
  createdAt: Date;
  likes: mongoose.Types.ObjectId[];
  tags: string[];
}

const BlogSchema = new Schema<IBlog>({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
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
  likes: [mongoose.Schema.Types.ObjectId],
  tags: [String],
});

const Blog = model<IBlog>("Blog", BlogSchema);
export default Blog;
