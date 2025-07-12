const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  googleId: String,
});

// save password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 14);

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
