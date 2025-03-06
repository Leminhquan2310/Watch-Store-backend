const feedbackModel = require("../Models/feedback.model");

const createFeedback = async (req, res) => {
  try {
    const result = await feedbackModel.create(req.body);
    res.status(201).json({
      data: result,
      message: "Created",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const result = await feedbackModel.find();
    res.status(200).json({
      data: result,
      message: "Get Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
};
