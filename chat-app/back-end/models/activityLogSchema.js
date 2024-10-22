const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  action: {
    type: String,
    required: true,
    enum: [
      "user_profile_updated",
      "login_successful",
      "login_failed",
      "logout_successful",
      "delete_account",
      "password_change",
      "password_reset_requested",
    ],
  },
  description: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  geoLocation: {
    ip: { type: String },
    country: { type: String },
    city: { type: String },
    district: { type: String },
    zipCode: { type: String },
    serviceProvider: { type: String },
  },
  requestMethod: {
    type: String,
    default: "GET",
  },
  requestUrl: {
    type: String,
  },
  responseStatusCode: {
    type: Number,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  logLevel: {
    type: String,
    enum: ["info", "warning", "error"],
    default: "info",
  },
  sessionId: {
    type: String,
  },
  responseTime: {
    type: String,
  },
  errorDetails: {
    message: { type: String },
    code: { type: String },
  },
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
