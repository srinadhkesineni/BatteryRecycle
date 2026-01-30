import User from "../models/User.js";
import Image from "../models/Image.js";

export const addCoins = async (req, res) => {
  const { userId, coins, imageId } = req.body;

  await User.findByIdAndUpdate(userId, {
    $inc: { coins }
  });

  await Image.findByIdAndUpdate(imageId, {
    status: "approved"
  });

  res.json({ message: "Coins added" });
};
