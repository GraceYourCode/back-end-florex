import { Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { generateCode } from "../utils/functions";
import { Code } from "../models/emailCodes";
import { User } from "../models/userModel";

dotenv.config();

export const sendMail = async (req: Request, res: Response) => {
  const { email, firstName } = req.body;
  const code = generateCode();

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
    subject: "Verification Code",
    // text,
    html: `
    <div>
      <p>Welcome ${firstName}, thanks for joining Future 4rx. </p>
      Your verification code is <strong>${code}</strong>
      <p>This code expires after 10 minutes</p>
    </div>
    `,
  };

  try {
    await Code.deleteMany({ email });

    await transporter.sendMail(mailOptions);

    const expiredAt = new Date(Date.now() + 10 * 60 * 1000);
    const newcode = await new Code({
      email,
      code,
      expiredAt,
    });

    await newcode.save();

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.log((err as Error).message);
    res
      .status(500)
      .json({ success: false, error: "Server error, failed to send email" });
  }
};

export const verifyMail = async (req: Request, res: Response) => {
  const { code, email } = req.body;

  const existingCode = await Code.findOne({ code, email });

  if (!existingCode) {
    res
      .status(400)
      .json({ success: false, error: "Invalid verification code or email" });
    return;
  }

  if (existingCode.expiredAt < new Date()) {
    res
      .status(401)
      .json({ success: false, error: "Verification Code expired" });
    return;
  }

  await Code.deleteOne({ code, email });
  res.status(200).json({ success: true, message: "Email Verified" });
};
