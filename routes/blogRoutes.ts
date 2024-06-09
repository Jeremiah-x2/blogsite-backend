import express, { Router } from 'express';
const router: Router = express.Router();
import {
  create_blog,
  delete_blog,
  get_all_blogs,
  update_blog,
} from '../controllers/blogController';
import { protect } from '../middlewares/authMiddleware';

router.post('/', protect, create_blog);
router.get('/', protect, get_all_blogs);
router.patch('/update/:blogId', protect, update_blog);
router.delete('/delete/:blogId', protect, delete_blog);
export default router;
