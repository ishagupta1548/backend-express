const mongoose = require("mongoose");
const User = require("../../models/users");
const bcrypt = require("bcryptjs");

// Function called when user registers
function userRegister(req, res) {
  User.find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length >= 0) {
        console.log("User with this email already exists");
      } else {
        var today = new Date();

        const text = req.body.email + req.body.password + today;

        bcrypt.hash(text, 10, (err, hash) => {
          if (!hash) {
            res.status(500).json({ message: err.message });
          } else {
            const newUser = new User({
              //Storing a unique user ID
              user_id: new mongoose.Types.ObjectId(),
              //User's name
              name: req.body.name,
              //User's email.
              email: req.body.email,
              //User's address
              address: req.body.address,
              //password
              password: hash,
              // setting loggedin flag to 1
              loggedIn: true,
            });

            newUser
              .save()
              .then((user) => {
                res.status(201).json("Created");
              })
              .catch((err) => {
                res.status(500).json({ message: err.message });
              });
          }
        });
      }
    });
}

// Function called when user logins
function userLogin(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .exec()
    .then((user) => {
      bcrypt.compare(password, user.password, (err, response) => {
        if (!response) {
          res.status(401).json({ Message: "Invalid password" });
        } else {
          res.status(200).json({ user_id: user.user_id });
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ message: err.messages });
    });
}

function allUsers() {}

function deleteUser() {
  User.findOneAndDelete({ username: req.params.username }, (err, user) => {
    //If any error occurs then send the error message as the response
    if (err) {
      result.status(500).json({ message: err.message });
    } else {
      //Send successfully deleted as the response message
      res.status(200).json({
        message: "Deleted user:" + user.name,
      });
    }
  });
}

module.export = {
  userRegister,
  userLogin,
  allUsers,
  deleteUser,
};
