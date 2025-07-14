const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// create a protect route
exports.protectRoutes = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return next(new AppError("Token not found", 404));
  }

  if (token && token.startsWith("Bearer ")) {
    token = token.split("Bearer ")[1];

    // decode the jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find the user by using token in db
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.user = user;
  }

  next();
});
