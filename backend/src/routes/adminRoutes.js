import Image from "../models/Image.js";
import express from "express";
const router = express.Router();
import { auth, isAdmin } from "../middleware/auth.js";
import User from "../models/User.js";


router.get("/uploads", auth, isAdmin, async (req, res) => {
  const images = await Image.find()
    .populate("userId", "email")
    .sort({ createdAt: -1 });

  res.json(images);
});

router.post("/approve/:id", auth, isAdmin, async (req, res) => {
  const { coins } = req.body;

  if (!coins || coins <= 0) {
    return res.status(400).json({ message: "Invalid coin value" });
  }

  const image = await Image.findById(req.params.id);
  if (!image) return res.status(404).json({ message: "Image not found" });

  image.status = "approved";
  image.coins = coins;
  await image.save();

  await User.findByIdAndUpdate(image.userId, {
    $inc: { coins },
  });

  res.json({ message: "Image approved and coins added" });
});

router.post("/reject/:id", auth, isAdmin, async (req, res) => {
  const image = await Image.findById(req.params.id);
  image.status = "rejected";
  await image.save();
  res.json({ message: "Rejected" });
});

export default router;
