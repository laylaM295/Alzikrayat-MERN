
const multer = require("multer");

const errorMiddleware = (err, req, res, next) => {
  console.error("Application Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  // Handle Multer upload errors
  if (err instanceof multer.MulterError) {
    const statusCode =
      err.code === "LIMIT_FILE_SIZE" ? 413 : 400;

    return res.status(statusCode).json({
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "Image size must not exceed 5 MB."
          : err.message,
    });
  }

  // Handle other application errors
  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    message:
      statusCode < 500
        ? err.message
        : "Internal server error",
  });
};

module.exports = errorMiddleware;
