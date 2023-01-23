/// Imports
const express = require("express");
const dotenv = require("dotenv").config();
// const cors = require('cors');
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const User = require("./models/User");
require("./middleware/passportJWT");
///

// Initialisations
const app = express();
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Checking status of mongoDB connection
console.log(mongoose.connection.readyState); //logs 0
mongoose.connection.on("connecting", () => {
  console.log("connecting");
  console.log(mongoose.connection.readyState); //logs 2
});
mongoose.connection.on("connected", () => {
  console.log("connected");
  console.log(mongoose.connection.readyState); //logs 1
});
mongoose.connection.on("disconnecting", () => {
  console.log("disconnecting");
  console.log(mongoose.connection.readyState); // logs 3
});
mongoose.connection.on("disconnected", () => {
  console.log("disconnected");
  console.log(mongoose.connection.readyState); //logs 0
});
//

(async () => mongoose.connect(process.env.MONGO_CONNECTION_STRING))();
// app.use(cors);
///

// Homepage
app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello world</h1>");
});

/// Register user
app.post("/register", (req, res) => {
  console.log("registering");

  // No username or password provided
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("Bad request");
  }

  // Hash password with 10 salt rounds
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    console.log("hashed password");

    // Create new user
    const user = new UserModel({
      username: req.body.username,
      password: hash,
    });
    console.log("made user var");

    // Save the new user to the database
    user.save((err, res) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          success: false,
          message: "Error registering user",
          error: err,
        });
      }
    });

    // Create and sign jwt
    const jwt_payload = {
      id: user._id,
      username: user.username,
    };

    const token = jwt.sign(jwt_payload, process.env.JWT_KEY, {
      expiresIn: `${process.env.JWT_EXPIRY_TIME}d`,
    });

    // Send success with jwt token
    return res.status(201).send({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
      },
      token: "Bearer " + token,
    });
  });
});

/// Login User
app.post("/login", (req, res) => {
  // Check if user provided username and password
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("Bad Request, no username or password");
  }
  console.log("Login attempt");

  UserModel.findOne({ username: req.body.username }, (err, doc) => {
    // Error
    if (err) {
      return res.status(500).send({
        success: false,
        error: "Server error finding user",
      });
    }

    // No error but no user
    if (!doc) {
      return res.status(401).send({
        success: false,
        error: "Could not find user",
      });
    }

    // Comparing Passwords
    bcrypt.compare(req.body.password, doc.password, (err, result) => {
      // Error comparing passwords
      if (err) {
        return res.status(500).send({
          success: false,
          message: "Server error comparing passwords",
        });
      }

      // Incorrect Password
      if (result === false) {
        return res.status(401).send({
          success: false,
          message: "Incorrect password",
        });
        // console.log("incorrect password");
        // return
      }

      // At this point, user is verified
      // Create and sign jwt
      const jwt_payload = {
        id: doc._id,
        username: doc.username,
      };

      const token = jwt.sign(jwt_payload, process.env.JWT_KEY, {
        expiresIn: `${process.env.JWT_EXPIRY_TIME}d`,
      });

      // Send success with jwt token
      return res.status(200).send({
        success: true,
        message: "User logged in successfully",
        token: "Bearer " + token,
      });
    });
  });
});

/// Protected Route
app.get(
  "/profile",
  passport.authenticate(["jwt"], { session: false }),
  (req, res) => {
    return res.status(200).send({
      success: true,
      user: {
        username: req.user.username,
        id: req.user._id,
      },
    });
  }
);

/// Logout
app.get("/logout", (req, res) => {
  console.log("logout");
});

// Start server on specified port
app.listen(process.env.BACKEND_PORT, () => {
  console.log("Server started");
});
