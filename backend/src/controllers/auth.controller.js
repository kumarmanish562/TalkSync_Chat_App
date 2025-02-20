import { generateToken } from "../lib/utils";
import User from "../models/user.model";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, fullName, password: hashedPassword });

    await newUser.save(); // Save the user first

    // Generate JWT token
    generateToken(newUser._id, res);

    return res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      profilePic: newUser.profilePic, // Fixed typo
    });
  } catch (error) {
    console.error("Signup error: ", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
