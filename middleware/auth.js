const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config();

module.exports = function (req, res, next) {
    // Get token from request headers
    const authHeader = req.headers['authorization'];
    // Check if token exists
    if (!authHeader) {
        return res.status(401).json({ message: "No authorization header, authorization denied" });
    }  

    const token = authHeader.split(' ')[1];

    if(!token) {
        return res.status(404).json({message: "No Token, authorization"})
    } 
 
    try {
        // Verify Token
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Extract token without "Bearer " prefix
        req.user = decoded; // Attach decoded user object to request object
        next(); // Call next middleware
    } catch (error) {
        return res.status(401).json({ message: "Token is not valid" });
    }

}