
const express = require("express");

const router = express.Router();

const {
  uploadPhoto,
  getAllPhotos,
  getPhotoById,
  getMyPhotos,
  deletePhoto,
} = require("../controllers/photoController");

const {
  addComment,
  getPhotoComments,
  deleteComment,
} = require("../controllers/commentController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Get all photos
router.get("/", getAllPhotos);

// Get current user's photos
router.get("/my", authMiddleware, getMyPhotos);

// Upload a photo
router.post(
  "/",
  authMiddleware,
  upload,
  uploadPhoto
);

// Get comments for a photo
router.get("/:photoId/comments", getPhotoComments);

// Add a comment to a photo
router.post(
  "/:photoId/comments",
  authMiddleware,
  addComment
);

// Delete a comment
router.delete(
  "/comments/:id",
  authMiddleware,
  deleteComment
);

// Delete a photo
router.delete(
  "/:id",
  authMiddleware,
  deletePhoto
);

// Get one photo by ID
router.get("/:id", getPhotoById);

module.exports = router;
