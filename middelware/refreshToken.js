const jwt = require("jsonwebtoken");
const secretKey = require('../crypto/secretKey')


const refreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  // Check if refresh token is valid
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is not valid" });
  }

  try {
    const decoded = jwt.verify(refreshToken, secretKey);
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      secretKey,
      { expiresIn: "1h" }
    );
    // Set the new access token in response headers
    res.setHeader("Authorization", newAccessToken);
    next();
    console.log(newAccessToken)
  } catch (error) {
    return res.status(401).json({ message: "invalid refresh token" });
  }
};

module.exports = { refreshToken };
