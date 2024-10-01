const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const asyncHandler = require('express-async-handler')

dotenv.config();

exports.logoutUser = asyncHandler(async(req, res) => {
      // Extract the token from the request headers
      const token = req.headers.authorization;
  
      // Check if token exists
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decodedToken = verifyToken(token)
  
      // Verify the token
      const verifyToken = (token) => {
        try {
        jwt.verify(token.split(' ')[1], process.env.SECRET_KEY);
      } catch (error) {
        console.error("Token verification error:", error.message);
        // Handle token verification errors
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: "Token has expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
      }
      
      // Respond with success message
      res.status(200).json({ message: "Logout successful" });
    }
  });