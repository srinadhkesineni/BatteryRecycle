import express from "express";
import multer from "multer";
import Image from "../models/Image.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// storage config
const storage = multer.diskStorage({
  destination: "src/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", auth, upload.single("image"), async (req, res) => {
  try {
    await Image.create({
      userId: req.user.userId, // ✅ THIS IS CRITICAL
      imagePath: req.file.filename,
      status: "pending",
    });

    res.status(201).json({
      message: "Image uploaded successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

// Get images uploaded by logged-in user
router.get("/my-images", auth, async (req, res) => {
  try {
    const images = await Image.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch images" });
  }
});

export default router;
