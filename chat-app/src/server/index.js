// server.js
const express = require("express");
const { createServer } = require("http");
const { fileURLToPath } = require("url");
const { dirname, join } = require("path");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle chat events
  socket.on("chat message", (msg) => {
    console.log("message: ", msg);
    io.emit("chat message", msg); // Broadcast the message to all clients
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

httpServer.listen(3000, () => {
  console.log("Express server running at http://localhost:3000");
});
