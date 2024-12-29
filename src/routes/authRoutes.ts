import express from 'express'
import { createNewPassword, forgotPassword, logout, signin, signup } from '../controllers/authController';
import { session } from '../middlewares/authMiddleware';
const router = express.Router();

// Routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", createNewPassword);
router.get('/session', session);

export default router;
