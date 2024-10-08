const express = require("express");
const router = express.Router();
const User = require("../models/User");
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
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");
const followController = require("../controllers/followController");
const {
  sendSmsHandler,
  verificationCodeHandler,
} = require("../services/twilioServices");
const userController = require("../controllers/userController");
const notificationController = require("../controllers/notificationController");
const { getUsers } = require("../controllers/userController");
const { refreshToken } = require("../middleware/refreshToken");
const loginLimiter = require("../middleware/rateLimitier");
const { forgotUsername } = require("../controllers/forgotUsername");
const { generate2FASecret, verify2FAToken } = require("../controllers/2FAController");


// Public Routes --------------------------------
router.get("/", getUsers);
router.get(
  "/notifications",
  authMiddleware,
  notificationController.getNotificationForUser
);

router.post(
  "/notifications/markAsRead",
  authMiddleware,
  notificationController.markNotificationAsRead
);

router.post("/refresh-token", refreshToken);

// Google OAuth Routes --------------------------------
router.get("/auth/google", authController.googleAuth);
router.post("/auth/google", authController.verifyGoogleToken);
router.get(
  "/auth/google/callback",
  authController.googleAuthCallback,
  authController.authSuccess
);

// User Profile --------------------------------
router.get("/:username", authMiddleware, userController.getUserProfile);
router.get("/:username/posts", authMiddleware, userController.getUserPosts);
router.get(
  "/:username/followers",
  authMiddleware,
  userController.getUserFollowers
);
router.get(
  "/:username/following",
  authMiddleware,
  userController.getUserFollowing
);
router.get(
  "/:username/follow-status",
  authMiddleware,
  userController.getFollowStatus
);

// User Routes --------------------------------
router.get("/profile", authController.getProfile);
router.get("/logout", authController.authLogout);
router.post("/register", registerUser);
router.post("/login",loginLimiter, loginUser);
router.post("/reset-password", resetPassword);
router.post("/set-new-password", setNewPassword);
router.get("/user-data", authMiddleware, getUserData);
router.put("/update-profile/:userId", authMiddleware, updateUserProfile);
router.post("/logout", authMiddleware, logoutUser);
router.delete("/delete/:userId", authMiddleware, deleteUser);
router.post("/verify-email/:token", verifyEmail);
router.post("/resend-verification", authMiddleware, resendVerificationEmail);
router.post("/forgot-username", forgotUsername)

// File Upload Routes -----------------------------
router.post(
  "/uploads",
  authMiddleware,
  upload.single("avatar"),
  handleAvatarUpload
);
router.delete("/delete-avatar/:userId", authMiddleware, handleDeleteAvatar);

// Post Routes -----------------------------
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
router.post("/posts/:postId/like", authMiddleware, postController.toggleLike);
router.get("/posts/:postId/likes", authMiddleware, userController.getPostLikes);
router.post(
  "/posts/:postId/comments",
  authMiddleware,
  postController.addComment
);
router.get(
  "/posts/:postId/comments",
  authMiddleware,
  postController.getComments
);
router.delete(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  postController.deleteComment
);

// Follow Routes ----------------------------------------
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
router.get(
  "/following/:userId",
  authMiddleware,
  followController.getFollowingUsers
);

// Notification Routes ---------------

// router.get("/test-follows", followController.getAllFollows);

// Send 2AUTH SMS ----------------------------------------
router.post("/send-verification-sms", sendSmsHandler);
router.post("/verify-sms", verificationCodeHandler);

// 2FA Authentication
router.post("/generate-2fa-secret", generate2FASecret)
router.post("/verify-2a", verify2FAToken)


// Example Error Route
router.get("/example", (req, res, next) => {
  const err = new Error("Example Error");
  next(err);
});

module.exports = router;
