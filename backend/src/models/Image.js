import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    imagePath: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    coins: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);
