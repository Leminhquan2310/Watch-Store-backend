const express = require("express");
const multer = require("multer");
const {
  uploadImage,
  removeUploadImage,
} = require("../Controllers/uploadImage.controller");
const uploadRouter = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

uploadRouter.post("/upload-images", upload.single("file"), uploadImage);
uploadRouter.delete("/delete-images", removeUploadImage);

module.exports = uploadRouter;
