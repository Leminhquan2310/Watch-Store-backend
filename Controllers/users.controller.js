const bcrypt = require("bcrypt");
const addressesModel = require("../Models/addresses.model");
const usersModel = require("../Models/users.model");
const jwt = require("jsonwebtoken");

const getAll = async (req, res, next) => {
  try {
    const data = await usersModel.find({});
    res.status(200).json({
      message: "Get Users success!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      data: error,
      message: error.message,
    });
  }
};

const createSimpleUser = async (req, res) => {
  const { name, username, password, email, phoneNumber, role } = req.body;
  const salt = await bcrypt.genSalt(10);

  try {
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await usersModel.create({
      name,
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      role,
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
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

const getUserAddresses = async (req, res) => {
  try {
    const userId = req.body.accountId;
    const user = await usersModel.findById(userId);
    const addresses = await addressesModel.find({
      _id: { $in: user.addressDelivery },
    });
    res.status(201).json(addresses);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const addAddressDelivery = async (req, res) => {
  try {
    const { userId, addressDelivery } = req.body;
    const [user, address] = await Promise.all([
      usersModel.findById(userId),
      addressesModel.create(addressDelivery),
    ]);
    user.addressDelivery.push(address._id);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const data = await usersModel.findByIdAndDelete({ _id: userId });
    res.status(200).json({
      data,
      message: "Delete User success!",
    });
  } catch (error) {
    res.status(500).json({
      data: error,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const user = req.body;
  let hashedPassword;
  const salt = await bcrypt.genSalt(10);

  try {
    const existUser = await usersModel.findById({ _id: user._id });

    if (user.password) {
      hashedPassword = await bcrypt.hash(user.password, salt);
    }

    existUser.name = user.name || user.name !== "" ? user.name : existUser.name;
    existUser.username =
      user.username || user.username !== ""
        ? user.username
        : existUser.username;
    existUser.email =
      user.email || user.email !== "" ? user.email : existUser.email;
    existUser.phoneNumber =
      user.phoneNumber || user.phoneNumber !== ""
        ? user.phoneNumber
        : existUser.phoneNumber;
    existUser.password = hashedPassword ?? existUser.password;
    existUser.role = user.role || user.role !== "" ? user.role : existUser.role;
    await existUser.save();
    res.status(201).json({
      data: existUser,
      message: "Update success",
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(400).json({
        [field]: {
          status: "error",
          message: `This ${field} is already exist!`,
        },
      });
    } else {
      res.status(500).json(error);
    }
  }
};

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

          res.status(200).json({
            accessToken,
            refreshToken,
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
      data: error,
    });
  }
};

module.exports = {
  getAll,
  createSimpleUser,
  getUserAddresses,
  addAddressDelivery,
  deleteUser,
  updateUser,
  login,
};
