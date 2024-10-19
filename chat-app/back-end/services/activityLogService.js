const ActivityLog = require("../models/activityLogSchema");

const logActivity = async (
  userId,
  action,
  description = "",
  idAddress = "",
  userAgent = ""
) => {
  try {
    const log = ActivityLog({
      userId,
      action,
      description,
      idAddress,
      userAgent,
    });
    await log.save();
  } catch (error) {
    console.error("Error logging activity", error);
  }
};

module.exports = { logActivity };
