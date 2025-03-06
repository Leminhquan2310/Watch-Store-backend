const bcrypt = require("bcrypt");
const usersModel = require("../Models/users.model");
const refreshTokenModel = require("../Models/refreshToken.model");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await usersModel.findOne({ username });

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error compare password" });
        }
        if (result) {
          const accessToken = jwt.sign(
            { username: user.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.TOKEN_LIFE }
          );

          const refreshToken = jwt.sign(
            { username: user.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_LIFE }
          );

          refreshTokenModel.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });

          res.status(200).json({
            accessToken,
            refreshToken,
            role: user.role,
          });
        } else {
          res.status(400).json({ message: "Password incorrect" });
        }
      });
    } else {
      res.status(500).json({
        message: "This user is not exist!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  const { name, email, username, password, phoneNumber } = req.body;
  const salt = await bcrypt.genSalt(10);
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await usersModel.create({
      name,
      email,
      username,
      password: hashedPassword,
      phoneNumber,
    });
    res.status(201).json(result);
  } catch (error) {
    if (error.code === 11000) {
      // Lỗi trùng lặp unique
      const field = Object.keys(error.keyValue)[0];
      res.status(400).json({
        [field]: { message: `This ${field} already exist!`, status: "error" },
      });
    } else {
      res.status(500).json("message: " + error.message);
    }
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    await refreshTokenModel.findOneAndDelete(refreshToken);
    res.status(201).json({
      message: "Logout success",
    });
  } catch (error) {
    res.status(500).json("message: " + error.message);
  }
};

module.exports = {
  login,
  register,
  logout,
};
