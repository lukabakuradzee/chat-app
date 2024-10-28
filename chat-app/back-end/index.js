const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const { Server } = require("socket.io");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
require("dotenv").config();

const app = express();
const port = 5500;

// Middleware Setup
app.use(express.json());
app.use(cors());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set secure cookies for production
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600000,
    },
  })
);

app.set('trust proxy', 1);
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

// MongoDB Connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

// Socket.IO Initialization
const initializeSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 
        "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);
    socket.emit("test", "This is a test message from the server");

    socket.on("send_message", () => {
      socket.broadcast.emit("receive_message");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

// Server Setup
const startServer = () => {
  let server;

  if (process.env.NODE_ENV === "production") {
    // Production Mode (HTTP)
    server = app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } else {
    // Development Mode (HTTPS)
    const fs = require("fs");
    const https = require("https");

    const sslOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_FILE),
      cert: fs.readFileSync(process.env.SSL_CRT_FILE),
    };

    server = https.createServer(sslOptions, app).listen(port, () => {
      console.log(`Server is running on https://localhost:${port}`);
    });
  }

  return server;
};

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.ip} ${req.method} ${req.url}`);
  next();
});

// User Routes
app.use("/api/users", userRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the application
const runApp = async () => {
  await connectToDatabase();
  const server = startServer();
  initializeSocketServer(server);
};

runApp();
