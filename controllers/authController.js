const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

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

  res.cookie("token", token);

  res.json({
    status: "success",
    token: token,
    data: saveUser,
  });
});

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

  res.cookie("token", token);

  res.status(200).json({
    status: "success",
    token,
    message: "login successfull",
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie("token");

  res.status(200).json({
    status: "success",
    message: "logout successfull",
  });
});
