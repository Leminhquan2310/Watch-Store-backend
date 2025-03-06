const productsModel = require("../Models/products.model");
const { cloudinary } = require("../config");
const streamifier = require("streamifier");

const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      {
        folder: "watch-store/product",
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

const createProduct = async (req, res) => {
  const { image_main, image_detail } = req.files;

  try {
    const result_img_main = await uploadImage(image_main[0]);
    const uploadDetailPromise = await image_detail.map(uploadImage);
    const result_upload_detail = await Promise.all(uploadDetailPromise);
    const result_img_detail = result_upload_detail.map((item) => {
      return { public_id: item.public_id, url: item.url };
    });

    const result_product = await productsModel.create({
      ...req.body,
      image_main: {
        public_id: result_img_main.public_id,
        url: result_img_main.url,
      },
      image_detail: result_img_detail,
    });

    res.status(201).json({
      data: result_product,
      message: "Created",
    });
  } catch (error) {
    res.status(500).json({
      data: error.message,
      message: "Error",
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const result = await productsModel.aggregate([
      {
        $lookup: {
          from: "brands", // Tên collection bạn muốn join
          localField: "brand_id", // Trường trong collection hiện tại
          foreignField: "_id", // Trường trong collection được join
          as: "brand_info", // Tên cho mảng mới chứa dữ liệu join
        },
      },
      {
        $unwind: "$brand_info", // Trải phẳng mảng brand_info
      },
    ]);
    res.status(200).json({
      data: result,
      message: "Get success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProductCondition = async (req, res) => {
  const { skip, limit, sort, discount } = req.query;

  let filters = {};
  if (discount === "true") {
    filters.discount = { $gt: 0 };
  }

  let sortOption = {};
  if (sort === "best_seller") {
    sortOption = { sold: -1 };
  } else if (sort === "newest") {
    sortOption = { createdAt: -1 };
  }

  try {
    const products = await productsModel
      .find(filters)
      .sort(sortOption)
      .limit(limit ?? 0)
      .skip(skip ?? 0);
    res.status(200).json({
      products,
      discount,
      sort,
      limit,
      skip,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getOneProduct = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await productsModel.findOne({ _id: id });
    res.status(200).json({
      data: result,
      message: "Get success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  const { image_main, image_detail } = req.files;
  const saved_image_detail_id = new Set(req.body.saved_image_detail.split(","));

  try {
    const product = await productsModel.findById(req.body._id);
    const missingPublicId = product.image_detail
      .map((image) => image.public_id)
      .filter((id) => !saved_image_detail_id.has(id));

    if (missingPublicId.length > 0) {
      try {
        await Promise.all(
          missingPublicId.map((public_id) => {
            cloudinary.uploader.destroy(
              public_id,
              { invalidate: true },
              (error, result) => {
                if (error) {
                  console.error(
                    "Error deleting image with cache invalidation:",
                    error
                  );
                }
              }
            );
          })
        );
        const result = await product.image_detail.filter(
          (item) => !missingPublicId.includes(item.public_id)
        );
        const uploadDetailPromise = await image_detail.map(uploadImage);
        const result_upload_Promise = await Promise.all(uploadDetailPromise);
        await result_upload_Promise.map((item) => {
          result.push({ public_id: item.public_id, url: item.url });
        });
        product.image_detail = result;
      } catch (error) {
        res.status(500).json({
          message: error,
        });
      }
    }

    if (image_main) {
      try {
        await cloudinary.uploader.destroy(
          product.image_main.public_id,
          { invalidate: true },
          (error, result) => {
            if (error) {
              console.error(
                "Error deleting image with cache invalidation:",
                error
              );
            }
          }
        );

        const result_img_main = await uploadImage(image_main[0]);
        product.image_main = {
          public_id: result_img_main.public_id,
          url: result_img_main.url,
        };
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.origin = req.body.origin || product.origin;
    product.sex = req.body.sex || product.sex;
    product.price = req.body.price || product.price;
    product.warranty = req.body.warranty || product.warranty;
    product.brand_id = req.body.brand_id || product.brand_id;
    product.color = req.body.color || product.color;
    product.discount = req.body.discount || product.discount;
    product.save();
    res.status(201).json({
      data: req.body,
      message: "Updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  const pro_id = req.params.pro_id;

  try {
    const product = await productsModel.findById(pro_id);
    await Promise.all(
      product.image_detail.map((img) => {
        cloudinary.uploader.destroy(
          img.public_id,
          { invalidate: true },
          (err, result) => {
            if (err) {
              console.log("Error deleting image with cache invalidation:", err);
            }
          }
        );
      }),
      cloudinary.uploader.destroy(product.image_main.public_id)
    );
    await productsModel.findByIdAndDelete({ _id: pro_id });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
  getProductCondition,
};
