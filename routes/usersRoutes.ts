import express, { Router } from 'express';
import {
  create_user,
  login_user,
  confirm_email,
} from '../controllers/userController';

const router: Router = express.Router();

router.post('/', create_user);
router.post('/login', login_user);
router.patch('/confirm/:usertoken', confirm_email);

export default router;
