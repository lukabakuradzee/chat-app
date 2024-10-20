const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activityType: {
    type: String,
    enum: ['login_successful', 'login_failed', 'password_reset_requested', 'profile_updated']
  },
  action: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('ActivityLog', activityLogSchema)