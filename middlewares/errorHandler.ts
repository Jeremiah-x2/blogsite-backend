import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export class CustomAppError implements AppError {
  name: string = 'AppError';
  message: string = 'An error occured';
  statusCode?: number | undefined;
  stack?: string | undefined;

  constructor(message: string, statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomAppError.prototype);
  }
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Middleware Error Hadnling');
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
};

export default errorHandler;
