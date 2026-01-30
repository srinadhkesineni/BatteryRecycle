import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    otp: String,
    otpExpiresAt: Date,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    coins: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
