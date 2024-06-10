import { NextFunction, Request, Response } from "express";
import Blog from "../models/blogModel";
import Comment from "../models/commentModel";
import { CustomAppError } from "../middlewares/errorHandler";

export const create_comment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const author = req.user;
    const { content } = req.body;
    const { blog } = req.params;
    if (!author) {
      throw new CustomAppError("Login before you can comment", 401);
    }
    if (content === "") {
      throw new CustomAppError("Content cannont be empty", 400);
    } else {
      const newComment = Comment.create({
        author,
        blog,
        content,
        date: new Date(),
      });
      res.status(201).json({ comment: newComment });
    }
  } catch (error) {
    next(error);
  }
};

export const get_blog_comments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { blogId } = req.params;
  const comments = await Comment.find({ _id: blogId });
  res.status(200).json({ comments });
};
