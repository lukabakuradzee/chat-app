const User = require("../models/User");
const Post = require("../models/postSchema")

exports.createPost = async (req, res) => {
  try {
    const { caption, userId } = req.body;
    const user = await User.findById(userId)
    const imageUrl = req.file ? `https://localhost:5500/uploads/${req.file.filename}` : null; // Adjust path based on your setup

    const newPost = new Post({
      user: user._id, // Assuming req.user is populated via authentication middleware
      caption: caption,
      image: imageUrl
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
    const posts = await Post.find({ user: req.params.userId }).populate('user').exec();
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

    console.log("Post id: ", postId)
    console.log("User id: ", userId)

    const postToDelete = await Post.findById(postId);


    if(!postToDelete) {
      return res.status(404).json({message: 'Post not found'});
    }

    if(postToDelete.user.toString() !== userId) {
      return res.status(403).json({message: 'User not authorized to delete this post'})
    }

    await postToDelete.deleteOne({_id: postId});
    return res.status(200).json({message: 'Post deleted successfully'})
  }  catch(error) {
    console.error(error)
    res.status(500).json({message: 'Server error'})
  }
}
