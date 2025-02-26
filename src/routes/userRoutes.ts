import express from "express";
import { deleteAUser, getAUser, getUsers, updatePassword } from "../controllers/userController";

const router = express.Router();

router.get("/", getUsers);
router.get("/:email", getAUser);
router.delete("/:userId", deleteAUser);
router.patch("/:userId/update-password", updatePassword)

export default router;
