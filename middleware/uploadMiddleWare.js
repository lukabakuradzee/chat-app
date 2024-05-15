const multer = require("multer");
const path = require("path");
const User = require("../models/User");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const handleAvatarUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No files were uploaded" });
    }
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.avatar = `http://localhost:5500/uploads/${req.file.filename}`;
    await user.save();

    console.log("user avatar: ", user.avatar);

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error while uploading file", error);
    res.status(500).json({ message: "Error uploading file" });
  }
};

module.exports = { upload, handleAvatarUpload };
