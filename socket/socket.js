const socketIo = require("socket.io");

let io; // Declare io variable

function init(server) {
  // Initialize socket.io with the provided server
  io = socketIo(server);

  // Set up event listeners
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Example: Listen for "updateUserProfile" event
    socket.on("updateUserProfile", async (data) => {
      // Update user profile in the database
      try {
        // Call the updateUserProfile function from your controller or wherever it's defined
        await updateUserProfile(data.userId, data.updatedProfile);
        // Emit a "userProfileUpdated" event to notify clients
        io.emit("userProfileUpdated", data.updatedProfile);
      } catch (error) {
        console.error("Failed to update user profile:", error);
      }
    });

    // Disconnect event listener
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}

function getIo() {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
}

module.exports = { init, getIo };
