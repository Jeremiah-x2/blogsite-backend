import express, { Response, Request, NextFunction, Router } from "express";
import User from "../models/userModel";
import { AppError, CustomAppError } from "../middlewares/errorHandler";
import bcrypt from "bcrypt";
import { decode, Jwt, JwtPayload, sign, verify } from "jsonwebtoken";

interface AuthForm {
  email: string;
  password: string;
  name: string;
}

export const create_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name }: AuthForm = req.body;
    console.log(email, password);
    if (email && password) {
      const isUserExist = await User.findOne({ email });
      if (isUserExist) {
        throw new CustomAppError("User already exists", 409);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        password,
        name,
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
      throw new CustomAppError("Email and Password required", 500);
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
      throw new CustomAppError("Email does not exist", 404);
    }
    const checkPassword = await bcrypt.compare(password, userExist.password);
    if (checkPassword) {
      if (!userExist.isAccountActive) {
        throw new CustomAppError(
          "Please, activate the account before you can login",
          401
        );
      }
      const token = generateToken(userExist._id);
      const cookie = `token=${token}; samesite=none; secure; max-age=3600000; path=/`;
      res.setHeader("set-cookie", cookie);
      res.status(201).json({ user: userExist });
    } else {
      throw new CustomAppError("Passwords do not match", 401);
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
  try {
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
  } catch (error) {
    next(error);
  }
};

export const logout_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  const cookie = `token=hello; samesite=none; secure, max-age=100000; path=/`;
  res.setHeader("set-cookie", cookie);
  res.status(201).json({ message: "User logged out" });
};

//TOKEN GENETATION FUNCTION
const generateToken = (id: any) => {
  return sign({ id }, process.env.JWT_KEY!);
};
