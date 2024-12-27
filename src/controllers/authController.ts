import * as bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { User } from "../models/userModel";
import {
  generateCode,
  isValidEmail,
  isValidPassword,
} from "../utils/functions";
import { generateToken, revokeToken, verifyToken } from "../utils/jwtUtils";
import { Code } from "../models/emailCodes";

dotenv.config();
// Interface for user data (optional but recommended for type safety)
interface UserInput {
  email: string;
  password: string;
  phone: string;
  country: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dob: Date;
}

// Sign-up controller
export const signup = async (
  req: Request<UserInput>,
  res: Response
): Promise<void> => {
  try {
    const {
      email,
      password,
      phone,
      country,
      dob,
      firstName,
      lastName,
      middleName,
      isClient,
    } = req.body;

    //Checks if password or email format is acceptable
    if (!isValidPassword(password) || !isValidEmail(email))
      res.status(400).json({
        success: false,
        error: "Password or email Format is not valid",
      });

    // Checking if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ success: false, error: "User already exists." });
    } else {
      // Hash the password for protection
      const hashedPassword = await bcrypt.hash(password, 10);

      //If user doesn't exist, Create a new user
      const user = new User({
        email,
        password: hashedPassword,
        phone,
        country,
        firstName,
        lastName,
        middleName,
        dob,
        isClient,
      });

      await user.save();

      res
        .status(201)
        .json({ success: true, message: "User registered successfully!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", success: false });
  }
};

// Sign-in controller
export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // Find the user
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ success: false, error: "User not registered!" });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res
        .status(400)
        .json({ success: false, error: "Invalid email or password!" });
    } else {
      // Generate a JWT
      const token = generateToken(email);

      res
        .status(200)
        .json({ success: true, message: "Successfully logged in", token });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Log out controller (clear the JWT cookie)
export const logout = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    await revokeToken(token); // Add token to the revoked list
  }
  res.status(200).json({ message: "Logged out successfully." });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const verificationCode = generateCode();
  const token = crypto.randomBytes(32).toString("hex");

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({ success: false, error: "User not registered!" });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER as string,
      pass: process.env.GMAIL_APP_PASSWORD as string,
    },
  });

  const mailOptions = {
    from: "Future 4rx",
    to: email,
    subject: "Forgot Password OTP",
    // text,
    html: `
    <div>
      <p>Here's a response to your request that you forgot your password</p>
      Your One-Time Password(OTP) is <strong>${verificationCode}</strong>
      <p>This code expires after 10 minutes</p>
      <p>If you didn't make this request, kindlyignore this email</p>
    </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);

    const existingCode = await Code.find({ email });

    if (existingCode.length > 0) {
      existingCode.forEach(async (code) => {
        code.expired = true;
        await code.save();
      });
    }

    user.resetToken = token;
    user.resetTokenExp = false;

    const code = await new Code({
      email,
      code: verificationCode,
    });

    await user.save();
    await code.save();

    setTimeout(async () => {
      code.expired = true;
      user.resetTokenExp = true;

      await user.save();
      await code.save();
    }, 60000 * 10);

    res
      .status(200)
      .json({ success: true, message: "Email sent successfully", token });
  } catch (err) {
    console.log((err as Error).message);
    res
      .status(500)
      .json({ success: false, error: "Server error, failed to send email" });
  }
};

export const createNewPassword = async (req: Request, res: Response) => {
  const { email, password, token } = req.body;

  //Checks if password format is acceptable
  if (!isValidPassword(password))
    res.status(400).json({
      success: false,
      error: "Password Format is not valid",
    });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, error: "User not found!" });
      return;
    }

    if (user.resetToken === token && !user.resetTokenExp) {
      user.password = hashedPassword;
      user.resetTokenExp = true;
      await user.save();

      res.status(201).json({ success: true, message: "New password created!" });
    } else res.status(403).json({ success: false, error: "Session expired!" });
  } catch (err) {
    console.log((err as Error).message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
