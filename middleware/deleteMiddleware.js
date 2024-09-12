const User = require("../models/User")

const handleDeleteAvatar = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if(!user) {
        res.status(404).json({ message: "User not found" });
      }

      const defaultAvatarUrl = 'http://localhost:5500/uploads/avatar.jpg'
      user.avatar = defaultAvatarUrl;
      await user.save();
      
      res.status(200).json({message: 'Profile photo was deleted successfully', user});
      console.log("User: ", user)
    } catch (error) {
      console.error("Error deleting profile photo", error);
      res.status(500).json({message: 'Error deleting profile photo'});
    } 
  }

  module.exports = handleDeleteAvatar;