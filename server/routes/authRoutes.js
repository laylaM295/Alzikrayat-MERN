
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Register a new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Logout user (requires authentication)
router.post("/logout", authMiddleware, logout);

// Get current logged-in user (requires authentication)
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
