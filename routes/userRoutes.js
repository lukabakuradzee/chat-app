const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const authMiddleware = require("../middelware/auth")

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.get("/user-data", authMiddleware, userController.getUserData);
router.put("/update-profile", authMiddleware, userController.updateUserProfile);


module.exports = router;