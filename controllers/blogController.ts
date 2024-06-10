import express, { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import Blog from "../models/blogModel";
import { AppError, CustomAppError } from "../middlewares/errorHandler";

export const create_blog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const author = req.user;
  console.log(author);
  const { title, content }: { title: string; content: string } = req.body;
  try {
    if (!author) {
      const unAuthErr: AppError = new Error(
        "Unauthorised. You can't create a blog because you are not signed in"
      );
      unAuthErr.statusCode = 401;
      next(unAuthErr);
      return;
    }
    if (!title || !content) {
      const requiredError: AppError = new Error(
        "Both title and content for the blog must be provided"
      );
      next(requiredError);
      return;
    }
    const newBlog = await Blog.create({
      author,
      title,
      content,
      likes: 0,
      createdAt: new Date(),
      tags: ["TODO"],
    });
    return res.status(201).json({ blog: newBlog });
  } catch (error) {
    next(error);
  }
};

export interface ParamsDictionary {
  [key: string]: string;
}

export const update_blog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const author = req.user;
  const { blogId } = req.params;
  try {
    const blog = await Blog.findById(blogId);

    console.log(blog?.author.toString(), Object(author));
    if (blog && blog.author.toString() === author._id.toString()) {
      const updateOps: ParamsDictionary = {};
      for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
      }
      const updatedBlog = await Blog.updateOne(
        { _id: blogId },
        { $set: updateOps },
        { new: true }
      );
      return res.status(201).json({ updatedBlog });
    }
    if (!blog) {
      const blogErr: AppError = new Error("Blog not found");
      blogErr.statusCode = 404;
      return next(blogErr);
    }
    if (blog.author !== author) {
      const userErr: AppError = new Error(
        "User does not have permission to modify this blog"
      );
      userErr.statusCode = 401;
      return next(userErr);
    }
  } catch (error) {
    next(error);
  }
};

export const get_all_blogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allBlogs = await Blog.find();
    console.log(allBlogs);
    return res.status(200).json({ blogs: allBlogs });
  } catch (error) {
    next(error);
  }
};

export const delete_blog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const author = req.user;
    const { blogId } = req.params;
    const isBlogExist = await Blog.findById(blogId);
    console.log(author, isBlogExist);
    if (isBlogExist && author === isBlogExist.author.toString()) {
      const deleteBlog = await Blog.findByIdAndDelete(blogId);
      return res.status(201).json({ blog: deleteBlog });
    }
    if (!isBlogExist) {
      throw new CustomAppError("Blog does not exist", 404);
    }
    if (author !== isBlogExist._id) {
      throw new CustomAppError("User can't delete this blog", 401);
    }
  } catch (error) {
    next(error);
  }
};

export const get_blog_by_id = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { blogId } = req.params;
    const isBlogExist = await Blog.findById(blogId);
    if (!isBlogExist) {
      throw new CustomAppError("Blog does not exits", 404);
    }
    res.status(200).json({ blog: isBlogExist });
  } catch (error) {}
};
