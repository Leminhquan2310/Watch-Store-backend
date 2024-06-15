const mongoose = require("mongoose");

module.exports = async () => {
  mongoose
    .connect(
      `mongodb+srv://quanleminh2310:${process.env.PASS_MONGOO_COMPASS}@cluster0.cto74pp.mongodb.net/WatchStore`
    )
    .then(() => {
      console.log("Connect success");
    })
    .catch((err) => {
      console.log("failed to connection", err);
    });
};
