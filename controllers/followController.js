const Follow = require("../models/followSchema");
const User = require("../models/User");

exports.followUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    console.log("follower id: ", followerId);
    const followingId = req.params.userId;
    console.log("following id: ", followingId);
    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: followingId,
    });
    
    if (existingFollow) {
      return res.status(404).json({ message: "Already following this user" });
    }
    const followingUser = await User.findById(followingId);
    
    if (!followingUser) {
      return res.status(404).json({ message: "User to follow not found" });
    }


    const follow = new Follow({
      follower: followerId, // Assuming req.user is populated via authentication middleware
      following: followingId,
    });



    await follow.save();
    console.log("Follow relationshp is created: ", follow);
    res.status(201).json(follow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.userId;
    await Follow.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const followers = await Follow.find({ following: userId }).populate(
      "follower",
      "username name"
    );
    res.status(200).json(followers);
    console.log("followers back: ", followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowingUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("User Id: ", userId);
    const following = await Follow.find({ follower: userId }).populate(
      "following",
      "username name"
    );
    if (!following) {
      return res
        .status(404)
        .json({ message: "No Following relationship was found" });
    } else {
      following.forEach((follow) => {
        console.log(
          `Following ID: ${follow.following._id}, Following Username: ${follow.following.username}`
        );
      });
    }
    console.log("Following result from DB: ", following);
    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllFollows = async (req, res) => {
  try {
    const follows = await Follow.find({}).populate(
      "follower following",
      "username name"
    );
    if (!follows || follows.length === 0) {
      return res.status(404).json({ message: "No follow relationship found" });
    } else {
      follows.forEach((follow) => {
        console.log(
          `Follower ID: ${follow.follower._id}, Follower username: ${follow.follower.username}, Following ID: ${follow.following._id}, Following username: ${follow.following.username}`
        );
      });
    }

    res.status(200).json(follows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
