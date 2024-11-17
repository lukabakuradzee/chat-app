const multerS3 = require("multer-s3");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require('multer')
const path = require("path");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = Date.now().toString() + path.extname(file.originalname);
      console.log("Uploading file:", fileName); // Log for debugging
      cb(null, fileName); 
    },
  }),
});

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
    user.avatar = req.file.location;
    await user.save();

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error while uploading file", error);
    res.status(500).json({ message: "Error uploading file" });
  }
};

module.exports = { upload, handleAvatarUpload };