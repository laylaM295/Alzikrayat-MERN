const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  fileName: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    default: "",
  },

  dateTime: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster photo queries
photoSchema.index({ userId: 1 });

module.exports =
  mongoose.models.Photo || mongoose.model("Photo", photoSchema);