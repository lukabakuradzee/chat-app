const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const User = require("../models/User");

dotenv.config();

exports.refreshToken =  async (req, res) => {
  const { refreshToken } = req.body;

  // Check if refresh token is valid
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }
  console.log("Refresh Token: ", refreshToken);

  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newToken = jwt.sign(
      {
        userAvatar: user.avatar,
        userId: user.id,
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      process.env.SECRET_KEY,
      { expires: "24h" }
    );

    const newRefreshToken = jwt.sign({userId: user.id}, process.env.SECRET_KEY, {
      expires: '7d'
    })
    // Set the new access token in response headers
    await User.findByIdAndUpdate(user.id, {refreshToken: newRefreshToken})

    res.status(200).json({ token: newToken, newRefreshToken });
    console.log(newRefreshToken, "newAccessToken");
  } catch (error) {
    return res.status(401).json({ message: "invalid refresh token" });
  }
};

