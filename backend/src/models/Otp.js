import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
  otp: String,
  expiresAt: Date
});

export default mongoose.model("Otp", otpSchema);
