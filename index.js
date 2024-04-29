const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const usersData = require("./api/users");
const posts = require("./api/images");
const personData = require("./api/person");

const app = express();
const http = require("http");
const { init } = require("./socket/socket");
const server = http.createServer(app);
const port = 5500;
const uri =
"mongodb+srv://lukabakuradzee:bakuradze1992@cluster0.kzocjug.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
app.use(express.json());

// Connect to MongoDB
mongoose.connect(uri);

// Using Cors
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests only from localhost:3000
  })
);

// Request informations in console logs
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

// initalize socket.io
init(server);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});