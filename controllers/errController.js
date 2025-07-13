exports.errController = (err, req, res, next) => {
  console.log(err);

  const { message } = err;
  res.status(400).json({
    status: "Error",
    message: message,
  });
};
