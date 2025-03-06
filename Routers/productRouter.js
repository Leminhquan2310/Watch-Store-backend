const express = require("express");
const {
  createProduct,
  getAllProduct,
  getOneProduct,
  updateProduct,
  testProduct,
  deleteProduct,
  getProductFlashSale,
  getProductCondition,
} = require("../Controllers/product.controller");
const multer = require("multer");
const verifyToken = require("../Middleware/verifyToken");

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
const productRouter = express.Router();

productRouter.get("/", verifyToken, getAllProduct);
productRouter.get("/product-condition", getProductCondition);
productRouter.post(
  "/create-product",
  verifyToken,
  upload.fields([
    {
      name: "image_main",
      maxCount: 1,
    },
    {
      name: "image_detail",
      maxCount: 5,
    },
  ]),
  createProduct
);
productRouter.post(
  "/update-product",
  verifyToken,
  upload.fields([
    {
      name: "image_main",
      maxCount: 1,
    },
    {
      name: "image_detail",
      maxCount: 5,
    },
  ]),
  updateProduct
);
productRouter.get("/get-product", getOneProduct);
productRouter.delete("/delete-product/:pro_id", verifyToken, deleteProduct);

module.exports = productRouter;
