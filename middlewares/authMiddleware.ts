import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { CustomAppError } from "./errorHandler";
import User from "../models/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      author?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      throw new CustomAppError("No token provided", 401);
    }
    const verifyToken = verify(token, "hello") as JwtPayload;
    const isUser = await User.findById(verifyToken.id);
    if (!isUser) {
      throw new CustomAppError("User not found", 404);
    }
    req.user = isUser.id;
    req.author = isUser.name;
    next();
  } catch (error) {
    if (error instanceof CustomAppError) {
      next(error);
    } else if (error instanceof Error) {
      console.log(error);
      if (error.name === "JsonWebTokenError") {
        next(new CustomAppError("Invalid token" + error, 401));
      } else if (error.name === "TokenExpiredError") {
        next(new CustomAppError("Token expired" + error, 401));
      } else {
        next(new CustomAppError("Authentication failed" + error, 500));
      }
    } else {
      next(new CustomAppError("An unknown error occurred" + error, 500));
    }
  }
};
