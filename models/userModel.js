const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  googleId: String,
});

// save password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 14);

  next();
});

// compare password
userSchema.methods.comaprePasswords = async function (
  userPassword,
  candidatePassword
) {
  return await bcryptjs.compare(userPassword, candidatePassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
