const User = require("../models/User");
const Post = require("../models/postSchema")

exports.createPost = async (req, res) => {
  try {
    const { caption, imageUrl } = req.body;
    const newPost = new Post({
      user: req.user._id, // Assuming req.user is populated via authentication middleware
      caption: caption,
      image: imageUrl
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).populate('user').exec();
    console.log("Fetching posts for user ID:", req.params.userId);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
