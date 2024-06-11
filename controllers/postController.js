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
    // Query the post and populate the likes array with the username field
    const post = await Post.findById(postId).populate({
      path: "likes",
      select: "username",
    });

    if (!post) return res.status(404).send("Post not found");

    console.log("Initial likes:", post.likes);

    if (!post.likes.includes(userId)) {
      await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } });
      console.log(`User ${userId} liked post ${postId}`);
    } else {
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      console.log(`User ${userId} unliked post ${postId}`);
    }

    // No need to populate likes again, as it's already populated in the initial query
    res.status(200).send({ message: "Like toggled", likes: post.likes });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { userId, text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send("Post not found");

    const comment = {
      user: userId,
      text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    const populatedPost = await Post.findById(postId).populate({
      path: "comments.user",
      select: "username",
    });

    console.log("Populated post: ", populatedPost);

    res
      .status(200)
      .send({ message: "Comment added", comments: populatedPost.comments });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getComments = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).populate(
      "comments.user",
      "username"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post.comments);
    console.log("post comments: ", post.comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json("Post not found");
    }
    
     const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
 
     if (commentIndex === -1) {
       return res.status(404).json({ message: "Comment not found" });
     }
    post.comments.splice(commentIndex, 1); 

    await post.save();
    res
      .status(200)
      .json({
        message: "Comment deleted successfully",
        comments: post.comments,
      });
    console.log("Deleted Comment: ", post.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
