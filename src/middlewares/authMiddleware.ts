import { Request, Response } from "express";
import { verifyToken } from "../utils/jwtUtils";

export const session = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(200).json({ session: null });
    return;
  }

  const decoded = await verifyToken(token);
  if (decoded) {
    res.status(200).json({ session: true });
    return
  }

  res.status(401).json({ session: null });
};