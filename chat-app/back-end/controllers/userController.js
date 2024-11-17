const User = require("../models/User");
const Post = require("../models/postSchema");
const Follow = require("../models/followSchema");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ user: user._id })
      .populate("user", "username name avatar")
      .populate("likes", "username name avatar");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserFollowers = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const followers = await Follow.find({ following: user._id }).populate(
      "follower",
      "username name"
    );
    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserFollowing = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const following = await Follow.find({ follower: user._id }).populate(
      "following",
      "username name"
    );
    res.status(200).json(following);
    console.log("following: ", following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowStatus = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const profileUser = await User.findOne({ username: req.params.username });

    if (!profileUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const followStatus = await Follow.findOne({
      follower: currentUserId,
      following: profileUser._id,
    });

    res.status(200).json({ isFollowing: !!followStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostLikes = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate(
      "likes",
      "username avatar"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Error: " + error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.fetchAllUserPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .populate("likes", "username")
      .populate("comments", "username");
    if (!posts) {
      return res.stats(404).json({ message: "Posts not found" });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error(500).json({ message: "Error posts from database", error });
    throw error;
  }
};
