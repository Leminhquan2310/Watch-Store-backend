const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  phoneNumber: { type: String, unique: true, required: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model("feedbacks", feedbackSchema);
