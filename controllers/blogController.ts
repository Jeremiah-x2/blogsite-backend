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
  const authorName = req.author;
  console.log(author);
  const { title, content }: { title: string; content: string } = req.body;
  try {
    if (!author) {
      throw new CustomAppError(
        "You can't create a blog because you are not signed in",
        401
      );
    }
    if (!title || !content) {
      throw new CustomAppError(
        "Both title and content for the blog must be provided",
        500
      );
    }
    const newBlog = await Blog.create({
      authorId: author,
      title,
      authorName,
      content,
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

    if (blog && blog.authorId.toString() === author._id.toString()) {
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
      throw new CustomAppError("Blog not found", 404);
    }
    if (blog.authorId !== author) {
      throw new CustomAppError(
        "User does not have permission to modify this blog",
        401
      );
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
    if (isBlogExist && author === isBlogExist.authorId.toString()) {
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

export const like_blog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Liking a blog", req.params.blogId);
  try {
    const user = req.user;
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blogId) {
      throw new CustomAppError("Blog not found", 404);
    }
    if (blog?.likes.includes(user)) {
      const unlikeBlog = await Blog.updateOne(
        { _id: blogId },
        { $pull: { likes: user } },
        { new: true }
      );
      return res.status(201).json({ blog: unlikeBlog });
    }
    const likeBlog = await Blog.updateOne(
      { _id: blogId },
      { $push: { likes: user } },
      { new: true }
    );
    return res.status(201).json({ blog: likeBlog });
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
