import express, { Response, Request, NextFunction, Router } from "express";
import User from "../models/userModel";
import { AppError } from "../middlewares/errorHandler";
import bcrypt from "bcrypt";
import { decode, Jwt, JwtPayload, sign, verify } from "jsonwebtoken";

interface AuthForm {
  email: string;
  password: string;
}

export const create_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password }: AuthForm = req.body;
    console.log(email, password);
    if (email && password) {
      const isUserExist = await User.findOne({ email });
      if (isUserExist) {
        const error: AppError = new Error("User already exists");
        error.statusCode = 400;
        next(error);
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        password,
      });
      const token = generateToken(newUser._id);
      const cookie = `token=${token}; samesite=none; secure, max-age=3600000; path=/`;
      res.setHeader("set-cookie", cookie);
      res.status(201).json({
        user: newUser,
        token,
        confirmationRoute: `http://localhost:8000/users/confirm/${token}`,
      });
    } else {
      const error: AppError = new Error("Email and Password required");
      next(error);
    }
  } catch (error) {
    next(error);
  }
  next();
};

export const login_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password }: AuthForm = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      const error: AppError = new Error("Email does not exists");
      error.statusCode = 404;
      next(error);
      return;
    }
    const checkPassword = await bcrypt.compare(password, userExist.password);
    if (checkPassword) {
      if (!userExist.isAccountActive) {
        const acctInActiveError: AppError = new Error(
          "Please, activate the account before you can login"
        );
        acctInActiveError.statusCode = 400;
        next(acctInActiveError);
        return;
      }
      const token = generateToken(userExist._id);
      const cookie = `token=${token}; samesite=none; secure, max-age=3600000; path=/`;
      res.setHeader("set-cookie", cookie);
      res.status(201).json({ user: userExist });
    } else {
      const wrongPasswordError: AppError = new Error("Passwords do not match");
      wrongPasswordError.statusCode = 401;
      next(wrongPasswordError);
      return;
    }
  } catch (error) {
    next(error);
  }
};

export const confirm_email = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { usertoken } = req.params;
  const verifyToken = verify(usertoken, "hello") as JwtPayload;
  if (typeof verify === "string") {
    throw new Error("Invalid token");
  }
  const findUser = await User.findById(verifyToken.id);
  if (!findUser) {
    throw new Error("Link probably been tampered with");
  }
  const confirmUser = await User.findByIdAndUpdate(
    verifyToken.id,
    {
      isAccountActive: true,
    },
    { new: true }
  );
  const token = generateToken(findUser._id);
  const cookie = `token=${token}; samesite=none; secure, max-age=3600000; path=/`;
  res.setHeader("set-cookie", cookie);
  res
    .status(200)
    .json({ token: (verifyToken as JwtPayload).id, user: findUser });
};

const generateToken = (id: any) => {
  return sign({ id }, "hello");
};
