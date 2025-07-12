const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  googleId: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
