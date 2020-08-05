const mongoose = require("mongoose");

//Creating a new device schema
const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  //Name of the user
  name: {
    type: String,
  },

  //Email of the user
  email: {
    type: String,
  },

  password: { type: String },

  loggedIn: false,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
