import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: Request, res: Response): void => {
  const token = req.cookies.jwt; // Get the JWT from the cookie

  if (!token) {
    res.status(401).json({ error: "Access Denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (decoded) res.status(200).json({session: true})
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token." });
  }
};
