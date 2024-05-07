// // socketServer.js
// const { Server } = require("socket.io");
// const express = require("express");
// const http = require("http");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Handle chat events
//   socket.on("chat message", (msg) => {
//     console.log("message: ", msg);
//     io.emit("chat message", msg); // Broadcast the message to all clients
//   });

//   // Handle disconnect
//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

// server.listen(4000, () => {
//   console.log("Socket.IO server running at http://localhost:4000");
// });
