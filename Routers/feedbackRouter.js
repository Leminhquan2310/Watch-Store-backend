const express = require("express");
const {
  createFeedback,
  getAllFeedback,
} = require("../Controllers/feedback.controller");
const verifyToken = require("../Middleware/verifyToken");

const feedbackRouter = express.Router();

feedbackRouter.post("/", createFeedback);

feedbackRouter.get("/", verifyToken, getAllFeedback);

module.exports = feedbackRouter;
