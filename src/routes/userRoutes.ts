import express from "express";
import { deleteAUser, getAUser, getUsers, updatePassword } from "../controllers/userController";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:userId", getAUser);
router.delete("/users/:userId", deleteAUser);
router.patch("/users/:userId/update-password", updatePassword)

export default router;
