const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// utils moduels (from the project)
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { sendEmail } = require("../utils/nodeMailer");
const { send } = require("process");

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// register the user
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new AppError("Please enter all the fields", 404));
  }

  const saveUser = await User.create({ name, email, password });
  if (!saveUser) {
    return next(new AppError("User is not created", 404));
  }

  const token = signToken(saveUser._id);

  res.json({
    status: "success",
    token: token,
    data: saveUser,
  });
});

// login the user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide credentials", 404));
  }

  const checkUser = await User.findOne({ email: email });
  if (!checkUser) {
    return next(new AppError("User not found", 404));
  }

  const checkPassword = await checkUser.comaprePasswords(
    password,
    checkUser.password
  );
  console.log(checkPassword);

  if (!checkPassword) {
    return next(new AppError("password does not match", 404));
  }

  const token = signToken(checkUser._id);

  res.status(200).json({
    status: "success",
    token,
    message: "login successfull",
  });
});

// logout the user
exports.logout = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "logout successfull",
  });
});

// forget the password
exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please Enter your email field", 404));
  }

  // check that user is exists or not
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const resetToken = crypto.randomBytes(12).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordTokenExpires = Date.now() + 30 * 1000;

  await user.save({ saveBeforeValidate: false });

  // generate the rest url
  const url = `${req.protocol}://${req.get(
    "host"
  )}/auth/resetpassword/${resetToken}`;
  const message = `click this link to change the password ${url}`;

  // sending email to client
  try {
    sendEmail({
      subject: "change your password",
      message: message,
    });
  } catch (error) {
    console.error("Error :- ", error);
  }

  // send respose to the client
  res.status(200).json({
    status: "success",
    message: "email send successfully",
  });
});

// reset the password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return next(new AppError("password not found", 404));
  }

  // create hashed token based on params
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // find the user in DB
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Update the profile
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordExpires = undefined;

  // save the profile
  await user.save();

  // send respose to client
  res.status(200).json({
    status: "success",
    message: "password reset successfully",
  });
});

// get the profile of the user
exports.getProfile = catchAsync(async (req, res, next) => {
  const user = req.user.id;
  const findUser = await User.findById(user);
  if (!findUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: findUser,
  });
});

// genrate the token when user is logged in via google
exports.googleCallback = catchAsync(async (req, res, next) => {
  const token = signToken(req.user.id);
  res.status(200).json({
    message: "Google Login successful",
    token,
    user: req.user,
  });
});
