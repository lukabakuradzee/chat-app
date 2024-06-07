const User = require("../models/User");
const Post = require("../models/postSchema");
const fs = require("fs");
const path = require("path");

exports.createPost = async (req, res) => {
  try {
    const { caption, userId } = req.body;
    const user = await User.findById(userId);
    const imageUrl = req.file
      ? `https://localhost:5500/uploads/${req.file.filename}`
      : null; // Adjust path based on your setup

    const newPost = new Post({
      user: user._id, // Assuming req.user is populated via authentication middleware
      caption: caption,
      image: imageUrl,
    });
    console.log("New Post: ", newPost);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate("user")
      .exec();
    console.log("Fetching posts for user ID:", req.params.userId);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;

    const postToDelete = await Post.findById(postId);

    if (!postToDelete) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (postToDelete.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this post" });
    }

    if (postToDelete.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(postToDelete.image)
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
    }

    await postToDelete.deleteOne({ _id: postId });
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleLike = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send('Post not found');

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId); // Like the post
    } else {
      post.likes.splice(index, 1); // Unlike the post
    }

    await post.save();
    res.status(200).send({ message: 'Like toggled', likes: post.likes });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { userId, text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send('Post not found');

    const comment = {
      user: userId,
      text,
      createdAt: new Date()
    };

    post.comments.push(comment);

    await post.save();
    res.status(200).send({ message: 'Comment added', comments: post.comments });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
