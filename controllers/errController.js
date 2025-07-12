exports.errController = (err, req, res, next) => {
  const { message, statusCode } = err;
  res.status(statusCode).json({
    status: "Error",
    statusCode: statusCode,
    message: message,
  });
};
