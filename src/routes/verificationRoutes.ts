import express from 'express'
import { sendVerificationCode, verifyCode } from '../controllers/verificationControllers';
import { sendMail, verifyMail } from '../controllers/emailVerificationController';

const router = express.Router();

router.post("/send-code", sendVerificationCode);
router.post("/verify-code", verifyCode);
router.post("/send-mail", sendMail)
router.post("/verify-mail", verifyMail)

export default router;