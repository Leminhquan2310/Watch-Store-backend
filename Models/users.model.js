const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 4 },
  username: { type: String, required: true, minlength: 4, unique: true },
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (value) {
        // Kiểm tra xem số điện thoại có đúng định dạng không (ví dụ: 10 chữ số)
        return /^\d{10}$/.test(value);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    unique: true,
    require: true,
  },
  addressDelivery: [{ type: mongoose.Schema.Types.ObjectId, ref: "addresses" }],
  createdAt: {
    type: Date,
    default: Date.now, // Default value
  },
});

// Tạo chỉ mục cho trường username và email
userSchema.index({ phoneNumber: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
// Tạo chỉ mục cho trường phoneNumber

module.exports = mongoose.model("users", userSchema);
