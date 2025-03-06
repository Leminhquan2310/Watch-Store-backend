const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dbc36tqn6",
  api_key: "434787689894844",
  api_secret: "BYSIUt6hpqVp2t94l0cMFa8GW1c",
});

module.exports = { cloudinary };
