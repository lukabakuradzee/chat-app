const Follow = require("../models/followSchema")

exports.followUser = async (req, res) => {
  try {
    const follow = new Follow({
      follower: req.user._id, // Assuming req.user is populated via authentication middleware
      following: req.params.userId
    });
    await follow.save();
    res.status(201).json(follow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    await Follow.findOneAndDelete({ follower: req.user._id, following: req.params.userId });
    res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
