const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: { type: String },
  ward: { type: String },
  district: { type: String },
  province: { type: String },
  postalCode: { type: String },
});

const addresses = mongoose.model("addresses", addressSchema);

module.exports = addresses;
