const mongoose = require("mongoose");

const refreshTokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

refreshTokenSchema.index({ expiresAt: 1, expireAfterSeconds: 0 });

const refreshToken = mongoose.model("refreshToken", refreshTokenSchema);

module.exports = refreshToken;
