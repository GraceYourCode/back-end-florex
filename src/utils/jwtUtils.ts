import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RevokedToken } from '../models/revokedTokens';

dotenv.config();
const secret = process.env.JWT_SECRET as string;


export const generateToken = (userId: string): string => {
  return jwt.sign({userId} , secret, { expiresIn: "1h" });
};

export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    const revokedToken = await RevokedToken.findOne({token: token})

    if (revokedToken) throw new Error ("Token is revoked");
    return decoded;
  } catch (err) {
    console.log((err as Error).message)
    return null; // Invalid token
  }
};

export const revokeToken = async (token: string): Promise<void> => {
  // Add token to blacklist
  const newRevokeToken = await new RevokedToken({token});
  newRevokeToken.save();
};
