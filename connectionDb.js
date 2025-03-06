const mongoose = require("mongoose");
const productsModel = require("./Models/products.model");

module.exports = async () => {
  mongoose
    .connect(
      `mongodb+srv://quanleminh2310:${process.env.PASS_MONGOO_COMPASS}@cluster0.cto74pp.mongodb.net/WatchStore`
    )
    .then(() => {
      console.log("Connect success");
      //   await productsModel.syncIndexes();
      //   console.log("Indexes updated successfully");

      //   // Đóng kết nối sau khi cập nhật
      //   mongoose.connection.close();
    })
    .catch((err) => {
      console.log("failed to connection", err);
    });
};
