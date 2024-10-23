const ActivityLog = require("../models/activityLogSchema");
const { getGeoLocation } = require("./geoLocation");

const logActivity = async (
  userId,
  action,
  description = "",
  req = {},
  responseStatusCode = 200,
  logLevel = "info"
) => {
  try {
    const ipAddress = req.ip || "";
      if (!ipAddress) {
        console.warn('No valid IP address found.');
      }

    const userAgent =
      req.headers && req.headers["user-agent"]
        ? req.headers["user-agent"]
        : "unknown"; // Default to "unknown"
    const geoLocation = await getGeoLocation(ipAddress);
    const username = req.user ? req.user.username : "unknown";

    console.log("Geolocation ", geoLocation);
        if (!geoLocation) {
      console.warn('Geolocation data could not be retrieved.');
    }

    const log = new ActivityLog({
      userId,
      username,
      role: req.user ? req.user.role : "user",
      action,
      description,
      ipAddress,
      userAgent,
      geoLocation,
      requestMethod: req.method || "GET",
      requestUrl: req.originalUrl || "",
      responseStatusCode,
      sessionId: req.sessionID || "",
      responseTime: req.responseTime || "",
      logLevel,
    });

    console.log('Activity log: ', log)

    console.log("username", username);
    await log.save();
    console.log("Activity logged successfully.");
  } catch (error) {
    console.error("Error logging activity", error);
  }
};

module.exports = { logActivity };
