import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Otp from "../models/Otp.js";
import { sendOTP } from "../utils/sendOTP.js";

/* =======================
   REGISTER
======================= */

export const register = async (req, res) => {
  try {
    console.log('working')
    const { name, email, password } = req.body;

    // If user already exists (verified user)
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Remove old OTP entry if exists (retry case)
    await Otp.deleteOne({ email });

    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = '12345'

    const hashedPassword = await bcrypt.hash(password, 10);

    await Otp.create({
      name,
      email,
      password: hashedPassword,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    // console.log("otp:", otp);
    // try {
    //   await sendOTP(email, otp);
    //   console.log("OTP email sent");
    // } catch (emailError) {
    //   console.error("EMAIL FAILED:", emailError);
    //   return res.status(500).json({
    //     message: "Failed to send OTP email",
    //   });
    // }

    // res.status(201).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

/* =======================
   LOGIN
======================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    // 2️⃣ Find user by email
    const user = await User.findOne({ email });

    // 3️⃣ If user does not exist
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // 5️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 6️⃣ Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // 7️⃣ Send response
    return res.status(200).json({
      token,
      role: user.role,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// verifying OTP //
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const pending = await Otp.findOne({ email });

  if (!pending || pending.otp !== otp || pending.expiresAt < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  console.log(pending.password);
  // Create REAL user now
  await User.create({
    name: pending.name,
    email: pending.email,
    password: pending.password,
    isVerified: true,
  });

  // Delete OTP entry
  await Otp.deleteOne({ email });

  res.json({ message: "Email verified successfully" });
};
