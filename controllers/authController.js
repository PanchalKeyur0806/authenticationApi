const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.register = catchAsync(async (req, res, next) => {
  res.json({
    status: "success",
  });
});
