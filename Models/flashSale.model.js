const mongoose = require("mongoose");

const flashSaleSchema = mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "products",
  },
});
