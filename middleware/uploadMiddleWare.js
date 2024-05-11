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
    const userId = req.user.id;

    await User.findById(userId, { avatar: req.file.path });

    res.send("File uploaded successfully");
  } catch (error) {
    console.error("Error while uploading file", error);
    res.status(500).json({ message: "Error uploading file" });
  }
};

module.exports = {upload, handleAvatarUpload};