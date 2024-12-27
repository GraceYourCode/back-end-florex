import { Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { generateCode } from "../utils/functions";
import { Code } from "../models/emailCodes";
import { User } from "../models/userModel";

dotenv.config();

export const sendMail = async (req: Request, res: Response) => {
  const { email, firstName } = req.body;
  const verificationCode = generateCode();

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
      Your verification code is <strong>${verificationCode}</strong>
      <p>This code expires after 10 minutes</p>
    </div>
    `,
  };

  try {
    const existingCode = await Code.find({ email });

    if (existingCode.length > 0) {
      existingCode.forEach(async (code) => {
        code.expired = true;
        await code.save();
      });
    }

    await transporter.sendMail(mailOptions);

    const code = await new Code({
      email,
      code: verificationCode,
    });

    await code.save();

    setTimeout(async () => {
      code.expired = true;

      await code.save();
    }, 60000 * 10);

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

  const existingCode = await Code.findOne({ code });

  if (!existingCode) {
    res
      .status(400)
      .json({ success: false, error: "Invalid verification code" });
    return;
  }

  if (existingCode.expired) {
    res
      .status(401)
      .json({ success: false, error: "Verification Code expired" });
    return;
  }
  if (code === existingCode.code && email === existingCode.email) {
    existingCode.expired = true;

    const user = await User.findOne({email});
    user.isEmailVerified = true;

    await existingCode.save();
    await user.save();

    res.status(200).json({ success: true, message: "Email Verified" });
  } else res.status(400).json({ success: false, error: "Incorrect code" });
};
