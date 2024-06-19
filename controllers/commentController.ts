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
    const authorName = req.author;
    const { content } = req.body;
    const { blog } = req.params;
    console.log(req.body);
    if (!author) {
      throw new CustomAppError("Login before you can comment", 401);
    }
    if (content === "") {
      throw new CustomAppError("Content cannont be empty", 400);
    } else {
      const newComment = await Comment.create({
        author,
        authorName,
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
  console.log(blogId);
  const comments = await Comment.find({ blog: blogId });
  console.log(comments);
  res.status(200).json({ comments });
};
