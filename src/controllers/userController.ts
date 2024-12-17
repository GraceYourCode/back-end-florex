import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "../models/userModel";

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find({});

  res.status(200).json({ success: true, data: users });
};

export const getAUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    res.status(200).json({ success: true, data: existingUser });
  } catch (err) {
    console.log((err as Error).message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const deleteAUser = async (req: Request, res: Response) => {
  const {userId} = req.params;

  try {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({success: true, message: "User successfully deleted"})
  } catch (err) {
    console.log((err as Error).message)
    res.status(500).json({success: false, error: "Server error"})
  }
}

export const updatePassword = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {newPassword, oldPassword} = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      res.status(400).json({ success: false, error: "Existing password is incorrect!" });
      return;
    } 

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({success: true, message: "Password updated successfully"})
  } catch (err) {
    console.log((err as Error).message)
    res.status(500).json({success: false, error: "Server error"})
  }
}

