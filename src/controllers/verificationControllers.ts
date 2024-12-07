import { Request, Response } from "express";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

const client = twilio(accountSid, authToken);

//Controller to send a verification code to the user's phone number
export const sendVerificationCode = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    res.status(400).json({
      success: false,
      message: "Phone number is required.",
    });
  }

  try {
    const response = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
      status: response.status,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Server error", err });
  }
};

//Controller to verify the code submitted by the user
export const verifyCode = async (req: Request, res: Response) => {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    res.status(400).json({
      success: false,
      message: "Phone number and verification code are required.",
    });
    return;
  }

  try {
    const response = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: phoneNumber, code: code });

    if (response.status === "approved") {
      res.status(200).json({
        success: true,
        message: "Phone number verified successfully.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error", success: false });
  }
};
