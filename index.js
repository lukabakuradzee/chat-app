const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const usersData = require("./api/users");
const posts = require("./api/images");
const personData = require("./api/person");


const app = express();
const port = 5500;
const uri = 'mongodb+srv://lukabakuradzee:bakuradze1992@cluster0.kzocjug.mongodb.net/';


app.use(express.json());

// Connect to MongoDB
mongoose.connect(uri)


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

// Define route for /
app.get(`/`, (req, res) => {
  res.send("Hello World");
});

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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
