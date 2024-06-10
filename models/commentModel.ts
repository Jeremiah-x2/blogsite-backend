import mongoose, { Schema, model, connect } from "mongoose";

interface IComment {
  author: mongoose.Types.ObjectId;
  blog: mongoose.Types.ObjectId;
  content: string;
  date: Date;
}

const commentSchema = new Schema<IComment>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    blog: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Blog" },
    content: {
      type: String,
      required: [true, "Provide content for your comment"],
    },
  },
  { timestamps: true }
);

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
