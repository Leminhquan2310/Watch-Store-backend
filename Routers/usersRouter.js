const express = require("express");
const {
  getAll,
  createSimpleUser,
  getUserAddresses,
  addAddressDelivery,
  deleteUser,
  updateUser,
  login,
} = require("../Controllers/users.controller");

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.get("/", getAll);
userRouter.post("/create-user", createSimpleUser);
userRouter.get("/find-addresses", getUserAddresses);
userRouter.post("/add-address", addAddressDelivery);
userRouter.delete("/delete-user", deleteUser);
userRouter.put("/update-user", updateUser);

module.exports = userRouter;
