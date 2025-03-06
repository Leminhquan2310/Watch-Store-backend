const express = require("express");
const {
  getAllBrand,
  createBrand,
  deleteBrand,
  updateBrand,
} = require("../Controllers/brand.controller");
const verifyToken = require("../Middleware/verifyToken");
const brandRouter = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

brandRouter.get("/", getAllBrand);
brandRouter.post(
  "/create-brand",
  upload.single("image"),
  verifyToken,
  createBrand
);
brandRouter.delete("/delete-brand/:brand_id", verifyToken, deleteBrand);
brandRouter.put(
  "/update-brand",
  upload.single("image"),
  verifyToken,
  updateBrand
);

module.exports = brandRouter;
