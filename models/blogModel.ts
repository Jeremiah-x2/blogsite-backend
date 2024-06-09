import mongoose, { Schema, model, connect } from 'mongoose';
import User from './userModel';

interface IBlog {
  author: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  likes: number;
  tags: string[];
}

const BlogSchema = new Schema<IBlog>({
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: {
    type: String,
    required: [true, 'Please provide a title for you blog'],
  },
  content: { type: String, required: [true, 'Provide content for your blog'] },
  createdAt: { type: Date },
  likes: Number,
  tags: [String],
});

const Blog = model<IBlog>('Blog', BlogSchema);
export default Blog;
