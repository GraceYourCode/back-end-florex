import * as bcrypt from "bcrypt"; // Import the entire bcrypt module
import * as jwt from "jsonwebtoken"; // Import the entire jsonwebtoken module
import { Request, Response } from "express"; // Import Express types
import { User } from "../models/userModel";
import { isValidEmail, isValidPassword } from "../utils/functions";
import { generateToken, revokeToken, verifyToken } from "../utils/jwtUtils";

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

    //Checks if password format is acceptable
    if (!isValidPassword(password) || !isValidEmail(email))
      res.status(400).json({
        success: false,
        error: "Password or email Format is not valid",
      });

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
      const token = generateToken(email);

      res.status(200).json({ message: "Successfully logged in", token });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Log out controller (clear the JWT cookie)
export const logout = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    await revokeToken(token); // Add token to the revoked list
  }
  res.status(200).json({ message: 'Logged out successfully.' });
};

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