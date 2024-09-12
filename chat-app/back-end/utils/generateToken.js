const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Function to generate JWT token
const generateToken = (payload) => {
  // Generate JWT token with payload and secret key
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' }); // Token expires in 24 hours
  return token;
};

module.exports = { generateToken };
