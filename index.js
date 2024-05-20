const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const usersData = require("./api/users");
const posts = require("./api/images");
const personData = require("./api/person");
const errorHandler = require("./middleware/errorHandler");
const path = require("path")
const fs = require("fs")

const app = express();
const https = require("https");
const user = require("./models/User");
// Read SSL/TLS certificate and private key
const options = {
  key: fs.readFileSync('./certs/localhost.key'),
  cert: fs.readFileSync('./certs/localhost.crt'),
  // ca: fs.readFileSync('ca.crt')
};
const server = https.createServer(options,app);
// Initialize the Socket.IO server with the HTTP server instance
const io = new Server(server, {
  cors: {
    origin: "https://localhost:3000", // Allow requests only from localhost:3000
    methods: ["GET", "POST", "PUT"],
  },
});

const port = 5500;
const uri =
  "mongodb+srv://lukabakuradzee:bakuradze1992@cluster0.kzocjug.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(uri);

// Cors for globbaly user routes
app.use(cors());
app.use('/uploads', express.static('uploads'));


// Request information in console logs
app.use((req, res, next) => {
  console.log(
    `[${new Date().toLocaleString()}]  ${req.ip} ${req.method} ${req.url}`
  );
  next();
});

app.use("/api/users", userRoutes);

// Define route for /api/users
app.get("/api/users", (req, res) => {
  res.json(usersData);
});

app.get("/api/person", (req, res) => {
  res.json(personData);
});

// Define route for /api/posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// Socket.IO integration
io.on("connection", (socket) => {
  // const username = socket.handshake.query.username;
  console.log(`a user connected ${socket.id}`);
  socket.emit("test", "This is a test message from the server");

  
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Error handling middleware (must be defined after all other route handlers and middleware functions)
app.use(errorHandler);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
