const express = require("express");
const {
  getAll,
  createSimpleUser,
  getUserAddresses,
  addAddressDelivery,
  deleteUser,
  updateUser,
  login,
  register,
} = require("../Controllers/users.controller");
const verifyToken = require("../Middleware/verifyToken");

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);

userRouter.get("/", verifyToken, getAll);
userRouter.post("/create-user", verifyToken, createSimpleUser);
userRouter.get("/find-addresses", verifyToken, getUserAddresses);
userRouter.post("/add-address", verifyToken, addAddressDelivery);
userRouter.delete("/delete-user", verifyToken, deleteUser);
userRouter.put("/update-user", verifyToken, updateUser);

module.exports = userRouter;
