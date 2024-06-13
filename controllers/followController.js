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

exports.getUserFollowers = async (req,res) => {
  try {
    const userId = req.params.userId;
    const followers = await Follow.find({following: userId}).populate('follower', 'username name')
    res.status(200).json(followers)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

exports.getFollowingUsers = async (req,res) => {
  try {
    const userId = req.params.userId;
    const following = await Follow.find({follower: userId}).populate('following', 'username name')
    res.status(200).json(following)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}