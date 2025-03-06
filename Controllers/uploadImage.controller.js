const { cloudinary } = require("../config");
const streamifier = require("streamifier");

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  // Sử dụng stream để tải ảnh lên cld
  let cld_upload_stream = cloudinary.uploader.upload_stream(
    {
      folder: "watch-store/product",
    },
    (error, result) => {
      if (error) {
        res.status(500).json({
          message: error.message,
        });
      }
      res.status(201).json({
        data: {
          uid: result.public_id,
          name: result.display_name,
          url: result.secure_url,
        },
        message: "Upload success",
      });
    }
  );

  // Tạo stream từ buffer và chuyển dữ liệu lên Cloudinary
  streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
};

const removeUploadImage = async (req, res) => {
  const { idImages } = req.body;
  const listResult = [];
  try {
    for (const public_id of idImages) {
      const resultDestroy = await cloudinary.uploader.destroy(public_id);
      listResult.push(resultDestroy);
    }
    res.status(200).json({
      data: listResult,
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  uploadImage,
  removeUploadImage,
};
