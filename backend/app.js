const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Routes
const postsRoutes = require("./routes/posts");

const app = express();

// Get link on mongo cluster. Make user with username and auto generated password. Changed db 'test' to 'node-angular'
mongoose.connect("mongodb+srv://kenny:TyM6HAcwADb0XZx0@cluster0-b9pqp.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
  console.log("Connected to DB!");
})
.catch(() => {
  console.log("Connection failed");
});

// Valid middleware for all paths for parsing JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); // Parsing URL data

// Middleware to prevent cross origin resource errors or sharing data between servers
// Connects server and Angular app
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // key, value (the domain that is sending the request)
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // Incoming request may have these extra headers
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});

// Use posts routes
app.use("/api/posts", postsRoutes);

module.exports = app;
