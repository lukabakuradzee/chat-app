const ActivityLog = require("../models/activityLogSchema");

const logActivity = async (
  userId,
  action,
  description = "",
  ipAddress = "",
  userAgent = ""
) => {
  try {
    const log = ActivityLog({
      userId,
      action,
      description,
      ipAddress,
      userAgent,
    });
    await log.save();
  } catch (error) {
    console.error("Error logging activity", error);
  }
};

module.exports = { logActivity };
