const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth')

router.get("/", authMiddleware, (req, res) => {
    const user = req.user;
    res.json({message: "Access granted", user})
})

module.exports = router;