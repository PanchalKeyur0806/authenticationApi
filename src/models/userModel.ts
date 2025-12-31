// const mongoose = require("mongoose");
// const bcryptjs = require("bcryptjs");
import mongoose, { InferSchemaType, Schema } from "mongoose";
import bcryptjs from "bcryptjs";

// types
import { IUser } from "../types/authType.js";

// creates the schema
const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  googleId: String,
  passwordResetToken: String,
  passwordTokenExpires: String,
});

export type UserDocument = InferSchemaType<typeof userSchema> & {
  comparePasswords(
    userPassword: string,
    candidatePassword: string
  ): Promise<boolean>;
};

// save password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (typeof this.password !== "string") {
    return next(new Error("Password must be a string"));
  }

  this.password = await bcryptjs.hash(this.password, 14);

  next();
});

// compare password
userSchema.methods.comparePasswords = async function (
  this: UserDocument,
  userPassword: string,
  candidatePassword: string
) {
  return await bcryptjs.compare(userPassword, candidatePassword);
};

const User = mongoose.model<UserDocument>("User", userSchema);

// module.exports = User;
export default User;
