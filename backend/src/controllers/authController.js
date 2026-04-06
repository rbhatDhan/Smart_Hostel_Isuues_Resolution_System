import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔥 GMAIL VALIDATION
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({
        message: "Only Gmail addresses are allowed",
      });
    }

    // 🔥 PASSWORD VALIDATION
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔐 HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 🔥 REMOVE PASSWORD FROM RESPONSE
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 GMAIL VALIDATION
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({
        message: "Only Gmail addresses are allowed",
      });
    }

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔥 REMOVE PASSWORD FROM RESPONSE
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.json({
      message: "Login successful",
      token,
      user: userResponse,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};