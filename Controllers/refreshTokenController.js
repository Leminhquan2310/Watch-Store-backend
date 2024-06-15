const jwt = require("jsonwebtoken");
const refreshTokenModel = require("../Models/refreshToken.model");
const usersModel = require("../Models/users.model");

const generateAccessToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(404).json({
      message: "Please provide refresh token",
    });
  }

  try {
    const result = await refreshTokenModel.findOne({ token });
    const decode = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await usersModel.findById(result.userId);
    if (user.username === decode.username) {
      const accessToken = jwt.sign(
        { username: decode.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_LIFE }
      );

      return res.status(200).json({
        accessToken,
      });
    } else {
      res.status(401);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateAccessToken,
};
