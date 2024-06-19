import express, { Router } from "express";
const router: Router = express.Router();
import {
  create_blog,
  delete_blog,
  get_all_blogs,
  get_blog_by_id,
  like_blog,
  update_blog,
} from "../controllers/blogController";
import { protect } from "../middlewares/authMiddleware";

router.post("/", protect, create_blog);
router.get("/", get_all_blogs);
router.get("/:blogId", get_blog_by_id);
router.patch("/update/:blogId", protect, update_blog);
router.delete("/delete/:blogId", protect, delete_blog);
router.patch("/blog/like/:blogId", protect, like_blog);
export default router;
