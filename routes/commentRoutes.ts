import express, { Router } from "express";
import {
  create_comment,
  get_blog_comments,
} from "../controllers/commentController";
import { protect } from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.post("/:blog", protect, create_comment);
router.get("/:blogId", get_blog_comments);

export default router;
