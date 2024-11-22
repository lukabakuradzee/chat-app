const User = require("../models/User");
const Post = require("../models/postSchema");
const notificationController = require("../controllers/notificationController");
const path = require("path");

const dotenv = require('dotenv');
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.createPost = async (req, res) => {
  try {
    const { caption, userId } = req.body;
    const user = await User.findById(userId);

    const image = req.files["image"] ? req.files["image"][0].location : null;
    const video = req.files["video"] ? req.files["video"][0].location : null;

    const newPost = new Post({
      user: user._id,
      caption: caption,
      image,
      video,
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


    const deleteFileFromS3 = async (fileUrl) => {
      const fileName = path.basename(fileUrl)
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
      }

    try {
      await s3.send(new DeleteObjectCommand(params))
      console.log(`File ${fileName} deleted from S3`);
    } catch (error) {
      console.error(`Error deleting file ${fileName} from S3:`, error)
    }

  }

    if (postToDelete.image) {
      await deleteFileFromS3(postToDelete.image);
    }

    if (postToDelete.video) {
      await deleteFileFromS3(postToDelete.video);
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

    await notificationController.createNotification(postId, userId, "comment");

    post.comments.push(comment);
    await post.save();

    const populatedPost = await Post.findById(postId).populate({
      path: "comments.user",
      select: "username",
    });

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

    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    post.comments.splice(commentIndex, 1);

    await post.save();
    res.status(200).json({
      message: "Comment deleted successfully",
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
