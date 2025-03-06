const express = require("express");
const { register, login, logout } = require("../Controllers/authController");

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.delete("/logout", logout);

module.exports = authRouter;
