
const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Photo = require("../models/Photo");

exports.addComment = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        message: "Please login to add a comment",
      });
    }

    const { comment } = req.body;
    const { photoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(photoId)) {
      return res.status(400).json({
        message: "Invalid photo ID",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const photoExists = await Photo.findById(photoId);

    if (!photoExists) {
      return res.status(404).json({
        message: "Photo not found",
      });
    }

    const newComment = await Comment.create({
      photoId,
      userId: req.session.userId,
      comment: comment.trim(),
    });

    await newComment.populate("userId", "firstName lastName");

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Add Comment Error:", error);

    res.status(500).json({
      message: "Could not add comment",
    });
  }
};

exports.getPhotoComments = async (req, res) => {
  try {
    const { photoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(photoId)) {
      return res.status(400).json({
        message: "Invalid photo ID",
      });
    }

    const comments = await Comment.find({ photoId })
      .populate("userId", "firstName lastName")
      .sort({ dateTime: -1 });

    res.json({ comments });
  } catch (error) {
    console.error("Get Photo Comments Error:", error);

    res.status(500).json({
      message: "Could not retrieve comments",
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        message: "Please login to delete a comment",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (
      comment.userId.toString() !==
      req.session.userId.toString()
    ) {
      return res.status(403).json({
        message: "You cannot delete this comment",
      });
    }

    await comment.deleteOne();

    res.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete Comment Error:", error);

    res.status(500).json({
      message: "Could not delete comment",
    });
  }
};
