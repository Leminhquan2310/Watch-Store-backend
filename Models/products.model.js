const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image_main: { type: Object, required: true },
  image_detail: { type: Array, required: true },
  origin: { type: String, required: true },
  sex: {
    type: String,
    enum: ["Male", "Female", "Unisex"],
    default: "Unisex",
    required: true,
  },
  price: { type: Number, required: true, min: 0 },
  warranty: { type: Number, default: 0, required: true },
  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "brands",
    required: true,
  },
  color: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  discount_expire: { type: Date },
  createdAt: { type: Date, required: true, default: Date.now() },
});

module.exports = mongoose.model("product", productSchema);
