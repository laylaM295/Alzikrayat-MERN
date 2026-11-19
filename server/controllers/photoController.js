
const Photo = require("../models/Photo");
const Comment = require("../models/Comment");
const fs = require("fs");
const path = require("path");

exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a photo",
      });
    }

    const { title, description } = req.body;

    if (!title || !title.trim()) {
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        message: "Photo title is required",
      });
    }

    const photo = await Photo.create({
      userId: req.session.userId,
      fileName: req.file.filename,
      title: title.trim(),
      description: description || "",
    });

    res.status(201).json({
      message: "Photo uploaded successfully",
      photo,
    });
  } catch (error) {
    console.error("Upload Photo Error:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: "Could not upload photo",
    });
  }
};

exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find()
      .populate("userId", "firstName lastName")
      .sort({ dateTime: -1 });

    res.json({ photos });
  } catch (error) {
    console.error("Get All Photos Error:", error);

    res.status(500).json({
      message: "Could not retrieve photos",
    });
  }
};

exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate("userId", "firstName lastName");

    if (!photo) {
      return res.status(404).json({
        message: "Photo not found",
      });
    }

    res.json({ photo });
  } catch (error) {
    console.error("Get Photo Error:", error);

    res.status(400).json({
      message: "Invalid photo ID",
    });
  }
};

exports.getMyPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({
      userId: req.session.userId,
    }).sort({ dateTime: -1 });

    res.json({ photos });
  } catch (error) {
    console.error("Get My Photos Error:", error);

    res.status(500).json({
      message: "Could not retrieve your photos",
    });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        message: "Photo not found",
      });
    }

    if (photo.userId.toString() !== req.session.userId.toString()) {
      return res.status(403).json({
        message: "You cannot delete this photo",
      });
    }

    await Comment.deleteMany({ photoId: photo._id });

    const imagePath = path.join(
      __dirname,
      "../uploads",
      photo.fileName
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await photo.deleteOne();

    res.json({
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Delete Photo Error:", error);

    res.status(500).json({
      message: "Could not delete photo",
    });
  }
};
