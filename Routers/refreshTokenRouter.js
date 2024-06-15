const express = require("express");
const {
  generateAccessToken,
} = require("../Controllers/refreshTokenController");

const refreshTokenRouter = express.Router();

refreshTokenRouter.post("/generate-token", generateAccessToken);

module.exports = refreshTokenRouter;
