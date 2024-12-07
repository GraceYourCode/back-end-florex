import express from 'express'
import { logout, session, signin, signup } from '../controllers/authController';
const router = express.Router();

// Routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout)
router.get('/session', session);

export default router;
