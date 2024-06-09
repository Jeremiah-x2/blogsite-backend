import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { CustomAppError } from './errorHandler';
import User from '../models/userModel';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if token is present in cookies
    const token = req.cookies.token;
    if (!token) {
      throw new CustomAppError('No token provided', 401);
    }

    // Verify the token
    const verifyToken = verify(token, 'hello') as JwtPayload;

    // Find the user by ID
    const isUser = await User.findById(verifyToken.id);

    if (!isUser) {
      throw new CustomAppError('User not found', 404);
    }

    // Attach user information to the request object
    req.user = isUser.id;
    next();
  } catch (error) {
    if (error instanceof CustomAppError) {
      next(error);
    } else if (error instanceof Error) {
      console.log(error);
      if (error.name === 'JsonWebTokenError') {
        next(new CustomAppError('Invalid token', 401));
      } else if (error.name === 'TokenExpiredError') {
        next(new CustomAppError('Token expired', 401));
      } else {
        next(new CustomAppError('Authentication failed', 500));
      }
    } else {
      next(new CustomAppError('An unknown error occurred', 500));
    }
  }
};
