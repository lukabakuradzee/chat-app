const Notification = require("../models/notificationSchema");
const User = require("../models/User");

// Function create a notification
exports.createNotification = async (
  recipientId,
  senderId,
  type,
  postId,
  content
) => {
  try {
    if (!["comment", "follow"].includes(type)) {
      throw new Error(`Invalid notification type: ${type}`);
    }
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      content: content,
      type: type,
      post: postId,
      createdAt: new Date(), 
    });
    await notification.save();
    console.log("Notification Created: ", notification);
    return notification;
  } catch (error) {
    console.error("error creating notification", error);
    throw error;
  }
};

// Function to get notification for a user
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    await Notification.updateMany(
      {
        _id: { $in: notificationIds },
      },
      { read: true }
    );
  } catch (error) {
    console.error("error marking notification as read", error);
  }
};

exports.getNotificationForUser = async (req, res) => {
  try {
    if (!req.user) {
      console.log("req.user is undefined");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.userId;
    console.log("User Id: ", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notifications = await Notification.find({ recipient: userId})
      .populate("recipient", "username")
      .populate("sender", "username")
      .sort({ createdAt: -1 });


    if (!notifications.length) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
