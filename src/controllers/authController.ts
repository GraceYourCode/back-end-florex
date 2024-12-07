import * as bcrypt from "bcrypt"; // Import the entire bcrypt module
import * as jwt from "jsonwebtoken"; // Import the entire jsonwebtoken module
import { Request, Response } from "express"; // Import Express types
import { User } from "../models/userModel";
import cookie from "cookie";

require("dotenv").config(); // Load environment variables for JWT_SECRET

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

    // Checking if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists." });
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

      res.status(201).json({ message: "User registered successfully!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", full: err });
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
      res.status(400).json({ error: "User not registered!" });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ error: "Invalid email or password!" });
    } else {
      // Generate a JWT
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "2h",
        }
      );

      // Set the token as a cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000 * 2,
      });

      res.status(200).json({ message: "Successfully logged in" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Log out controller (clear the JWT cookie)
export const logOut = (req: Request, res: Response): void => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
