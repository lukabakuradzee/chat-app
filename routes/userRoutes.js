const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { registerUser } = require("../controllers/registerUser");
const { verifyEmail } = require("../controllers/verifyEmail");
const { loginUser } = require("../controllers/loginUser");
const { getUserData } = require("../controllers/userData");
const { updateUserProfile } = require("../controllers/updateUserProfile");
const { logoutUser } = require("../controllers/logoutUser");
const { setNewPassword } = require("../controllers/setNewPassword");
const { resetPassword } = require("../controllers/resetPassword");
const { deleteUser } = require("../controllers/deleteUser");
const {
  resendVerificationEmail,
} = require("../controllers/resendVerificationEmail");
const handleDeleteAvatar = require("../middleware/deleteMiddleware");
const {
  upload,
  handleAvatarUpload,
} = require("../middleware/uploadMiddleWare");
const { getUsers } = require("../api/person");
const authController = require("../controllers/autController");
const postController = require("../controllers/postController");
const followController = require("../controllers/followController");
const {
  sendSmsHandler,
  verificationCodeHandler,
} = require("../services/twilioServices");

// Google OAuth Routes
router.get("/auth/google", authController.googleAuth);
router.post("/auth/google", authController.verifyGoogleToken);
router.get(
  "/auth/google/callback",
  authController.googleAuthCallback,
  authController.authSuccess
);

// User Routes
router.get("/profile", authController.getProfile);
router.get("/logout", authController.authLogout);
router.get("/person", authMiddleware, getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);
router.post("/set-new-password", setNewPassword);
router.get("/user-data", authMiddleware, getUserData);
router.put("/update-profile/:userId", authMiddleware, updateUserProfile);
router.post("/logout", authMiddleware, logoutUser);
router.delete("/delete/:userId", authMiddleware, deleteUser);
router.post("/verify-email/:token", verifyEmail);
router.post("/resend-verification", authMiddleware, resendVerificationEmail);

// File Upload Routes
router.post(
  "/uploads",
  authMiddleware,
  upload.single("avatar"),
  handleAvatarUpload
);
router.delete("/delete-avatar/:userId", authMiddleware, handleDeleteAvatar);

// Post Routes
router.post(
  "/posts",
  authMiddleware,
  upload.single("image"),
  postController.createPost
);
router.delete(
  "/delete-post/:postId",
  authMiddleware,
  postController.deleteUserPost
);
router.get("/posts/:userId", authMiddleware, postController.getUserPosts);
router.post("/posts/:postId/like", postController.toggleLike);
router.post("/posts/:postId/comment", postController.addComment),

// Follow Routes
router.post("/follow/:userId", authMiddleware, followController.followUser);
router.delete(
  "/unfollow/:userId",
  authMiddleware,
  followController.unfollowUser
);
router.get(
  "/followers/:userId",
  authMiddleware,
  followController.getUserFollowers
);

// Send 2AUTH SMS
router.post("/send-verification-sms", sendSmsHandler);
router.post("/verify-sms", verificationCodeHandler);

// Example Error Route
router.get("/example", (req, res, next) => {
  const err = new Error("Example Error");
  next(err);
});

module.exports = router;
