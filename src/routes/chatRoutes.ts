import express from 'express'
import { createRoom, getMessages, sendMessage } from '../controllers/chatContoller';

const router = express.Router();

router.post("/create-room", createRoom);
router.post("/send-message", sendMessage);
router.get("/get-messages/:roomId", getMessages);

export default router;