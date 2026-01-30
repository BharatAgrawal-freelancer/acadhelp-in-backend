import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Otp from "../models/otp.js";
import { sendOtpMail } from "../middleware/mailer.js";
import jwt from "jsonwebtoken";

/* ======================================================
   UTILS
====================================================== */

const normalizeEmail = (email) =>
  email.trim().toLowerCase();

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (userId) => {
  return jwt.sign(
    { userId },                 // payload
    process.env.JWT_SECRET,     // secret
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.json(req.user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   SIGNUP
====================================================== */

export const signup = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email required" });

    email = normalizeEmail(email);

    const existingUser = await User.findOne({ email });

    const otp = generateOtp();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpMail(email, otp);

    if (existingUser) {
      if (existingUser.provider === "google" && !existingUser.password) {
        return res.json({
          message:
            "Account created using Google. Verify OTP to set password.",
          step: "VERIFY_OTP",
        });
      }

      return res.status(400).json({
        message: "Email already registered",
      });
    }

    await User.create({
      email,
      provider: "form",
      isverified: false,
    });

    res.json({
      message: "OTP sent to email",
      step: "VERIFY_OTP",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   VERIFY OTP
====================================================== */

export const verifyOtp = async (req, res) => {
  try {
    let { email, otp, password } = req.body;

    // -------------------------
    // validations
    // -------------------------
    if (!email || !otp || !password) {
      return res.status(400).json({
        message: "Email, OTP and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    email = email.trim().toLowerCase();

    // -------------------------
    // verify OTP
    // -------------------------
    const record = await Otp.findOne({ email, otp });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // -------------------------
    // find user
    // -------------------------
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // -------------------------
    // set password
    // -------------------------
    const hash = await bcrypt.hash(password, 10);

    user.password = hash;
    user.isverified = true;

    await user.save();

    // -------------------------
    // cleanup OTP
    // -------------------------
    await Otp.deleteMany({ email });

    res.json({
      message: "OTP verified and password set successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   LOGIN
====================================================== */
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    email = normalizeEmail(email);

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.password) {
      return res.status(400).json({
        message: "Password not set for this account",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ✅ CREATE JWT TOKEN
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,           // 🔥 JWT
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
