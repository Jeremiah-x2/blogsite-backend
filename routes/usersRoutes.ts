import express, { Router } from "express";
import {
  create_user,
  login_user,
  confirm_email,
  logout_user,
} from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";
import passport from "passport";
import "../strategies/githubStrategy";

const router: Router = express.Router();

router.post("/", create_user);
router.post("/login", login_user);
router.patch("/confirm/:usertoken", confirm_email);
router.post("/logout", protect, logout_user);

export default router;
