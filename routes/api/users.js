// Requiring all the dependencies and the functions
const express = require("express");
const route = express.Router();
const users = require("../functions/users");
const User = require("../../models/users");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Route to get details of all the users stored in the database.
route.post("/register", (req, res) => {
  User.find({ email: req.body.userDetail.email })
    .exec()
    .then((users) => {
      if (users.length > 0) {
        console.log("User with this email already exists");
        return res.status(401).json({ message: "User exists" });
      } else {
        bcrypt.hash(req.body.userDetail.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
          } else {
            const newUser = new User({
              //Storing a unique user ID
              user_id: new mongoose.Types.ObjectId(),
              //User's name
              name: req.body.userDetail.name,
              //User's email.
              email: req.body.userDetail.email,
              //password
              password: hash,
              // setting loggedin flag to 1
              loggedIn: true,
            });

            newUser.save((err, user) => {
              if (err) {
                console.log(err);
              } else {
                res.status(201).json(user);
              }
            });
          }
        });
      }
    });
});

// Route to login the user.
route.post("/login", (req, res) => {
  const email = req.body.userDetail.email;
  const password = req.body.userDetail.password;

  User.findOne({ email: email })
    .exec()
    .then((user) => {
      bcrypt.compare(password, user.password).then((isMatch) => {
        console.log(isMatch);
        if (isMatch) {
          res.status(200).json({ message: "Logged in" });
        } else {
          res.status(400).json({ message: "invalid password" });
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ message: "User not found" });
    });
});

// Route to get all the users
route.get("/all", (req, res) => {
  User.find({}, { _id: 0, __v: 0, password: 0, api_key: 0 })
    .exec()
    .then((users) => {
      if (users === null)
        res.status(404).json({ message: "No users in the database!" });
      else res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// Route to delete a user from the database.
route.delete("/delete/:email", (req, res) => {
  User.findOneAndDelete({ email: req.params.email }, (err, user) => {
    //If any error occurs then send the error message as the response
    if (err) {
      result.status(500).json({ message: err.message });
    }
    if (user) {
      //Send successfully deleted as the response message
      res.status(200).json({
        message: "Deleted user!",
      });
    }
  });
});

module.exports = route;
