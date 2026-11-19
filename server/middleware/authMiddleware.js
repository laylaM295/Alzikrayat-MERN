
const authMiddleware = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      message: "Authentication required. Please login first.",
    });
  }

  next();
};

module.exports = authMiddleware;
