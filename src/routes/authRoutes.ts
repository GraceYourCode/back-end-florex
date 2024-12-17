import express from 'express'
import { logout, signin, signup } from '../controllers/authController';
import { session } from '../middlewares/authMiddleware';
const router = express.Router();

// Routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout)
router.get('/session', session);

export default router;
