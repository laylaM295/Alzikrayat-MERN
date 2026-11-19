
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },

  location: {
    type: String,
    default: "",
    trim: true,
  },

  description: {
    type: String,
    default: "",
    trim: true,
  },

  occupation: {
    type: String,
    default: "",
    trim: true,
  },

  dateTime: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
