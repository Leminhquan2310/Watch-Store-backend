const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  image: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("brands", brandSchema);
