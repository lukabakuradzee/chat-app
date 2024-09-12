const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

exports.logoutUser = async (req, res) => {
    try {
      // Extract the token from the request headers
      const token = req.headers.authorization;
  
      // Check if token exists
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
  
      // Verify the token
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
  
      // Perform any necessary logout operations (if needed)
      
      // Respond with success message
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error.message);
      res.status(500).json({ message: "Failed to logout" });
    }
  };