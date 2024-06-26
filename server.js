const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const usersRouter = require("./Routers/usersRouter");
const cors = require("cors");
const refreshTokenRouter = require("./Routers/refreshTokenRouter");

const connect = require("./connectionDb");
connect();
const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/v1/user", usersRouter);
app.use("/api/v1/refresh-token", refreshTokenRouter);

app.listen(process.env.PORT || 3000, (req, res) => {
  console.log("Express app listening on port 3000");
});
app.get("/", (req, res) => {
  res.send("Hello World! 123");
});
