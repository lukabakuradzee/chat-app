const jwt = require('jsonwebtoken');
const secretKey = require('../crypto/secretKey')

// Function to generate JWT token
const generateToken = (payload) => {
  // Generate JWT token with payload and secret key
  const token = jwt.sign(payload, secretKey, { expiresIn: '24h' }); // Token expires in 24 hours
  return token;
};

module.exports = { generateToken };
