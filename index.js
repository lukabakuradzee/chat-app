const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
// const usersData = require("./api/users");
// const personData = require("./api/person");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const User = require("./models/User");

require("dotenv").config();

const fs = require("fs");
const app = express();
const https = require("https");

// Read SSL/TLS certificate and private key
const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_FILE),
  cert: fs.readFileSync(process.env.SSL_CRT_FILE),
};
const server = https.createServer(sslOptions, app);

// Initialize the Socket.IO server with the HTTP server instance
const io = new Server(server, {
  cors: {
    origin: "https://localhost:3000", // Allow requests only from localhost:3000
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

const port = 5500;

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/test', (req, res) => {
  console.log("Route /test accessed");
  res.status(200).send("Route /test is working");
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Cors for globally user routes
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Request information in console logs
app.use((req, res, next) => {
  console.log(
    `[${new Date().toLocaleString()}]  ${req.ip} ${req.method} ${req.url}`
  );
  next();
});

// User Routes





// Define route for /api/users
// app.get("/api/users", (req, res) => {
//   res.json(getData);
// });

// Define route for /api/posts
// app.get("/api/posts", (req, res) => {
//   res.json(posts);
// });

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

// app.get("/", (req, res) => {
//   res.send('<h1>Home Page</h1><a href="/auth/google">Login with Google</a>');
// });
app.use("/api/users", userRoutes)

// Error handling middleware (must be defined after all other route handlers and middleware functions)
app.use(errorHandler);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
