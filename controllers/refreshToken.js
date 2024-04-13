const User = require('../models/User');

exports.refreshToken = async (req, res) => {
    try {
        const {refreshToken} = req.body;
        
        // Check if refresh toke is provided
        if(!refreshToken) {
            return res.status(400).json({message: "Refresh token is required"})
        }

        const user = await User.findOne({refreshToken})
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        // Generate new access token
        const accessToken  = generateAccessToken(user)
        // Returns new access token
        res.status(200).json({accessToken});

    } catch (error) {
     console.error(error)
     res.status(500).json({message: "Failed to refresh access token"})
    }
 };