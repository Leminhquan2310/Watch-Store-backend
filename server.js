const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const connect = require("./connectionDb");
const productRouter = require("./Routers/productRouter");
const uploadRouter = require("./Routers/uploadRouter");
const brandRouter = require("./Routers/brandRouter");
const refreshTokenRouter = require("./Routers/refreshTokenRouter");
const usersRouter = require("./Routers/usersRouter");
const authRouter = require("./Routers/authRouter");
const feedbackRouter = require("./Routers/feedbackRouter");
connect();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1/user", usersRouter);
app.use("/api/v1/refresh-token", refreshTokenRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/feedback", feedbackRouter);

app.listen(process.env.PORT || 3000, (req, res) => {
  console.log("Express app listening on port 3000");
});
app.get("/", (req, res) => {
  res.send("Hello World! 123");
});
