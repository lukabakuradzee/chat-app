const express = require('express');
const router = express.Router();
const auth = ("../middleware/auth");

router.get("/", auth, (req, res) => {
    const user = req.user;
    res.json({message: "Access granted", user})
})

module.exports = router;