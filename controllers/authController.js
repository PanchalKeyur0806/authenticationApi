const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new AppError("Please enter all the fields", 404));
  }

  const saveUser = await User.create({ name, email, password });

  res.json({
    status: "success",
    data: saveUser,
  });
});
