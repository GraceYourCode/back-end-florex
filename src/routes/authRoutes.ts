import express from 'express'
import { logOut, signin, signup } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';
const router = express.Router();

// Routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('logout', logOut)
router.get('/session', authenticate);

export default router;
