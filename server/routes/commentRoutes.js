
const express = require("express");
const router = express.Router();

const {
  addComment,
  getPhotoComments,
  deleteComment,
} = require("../controllers/commentController");

const authMiddleware = require("../middleware/authMiddleware");

// Get all comments for a photo
router.get("/:photoId", getPhotoComments);

// Add a comment to a photo
router.post("/:photoId", authMiddleware, addComment);

// Delete a comment
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;
