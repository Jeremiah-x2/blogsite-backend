import mongoose, { Schema, model, connect } from "mongoose";

interface IComment {
  author: mongoose.Types.ObjectId;
  blog: mongoose.Types.ObjectId;
  authorName: string;
  content: string;
  date: Date;
  likes: mongoose.Types.ObjectId[];
}

const commentSchema = new Schema<IComment>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    blog: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Blog" },
    authorName: String,
    content: {
      type: String,
      required: [true, "Provide content for your comment"],
    },
    likes: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true }
);

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
