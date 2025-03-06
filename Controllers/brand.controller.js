const { cloudinary } = require("../config");
const brandModel = require("../Models/brand.model");
const productsModel = require("../Models/products.model");
const streamifier = require("streamifier");

const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "watch-store/brand",
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

const getAllBrand = async (req, res) => {
  try {
    const resultBrands = await brandModel.find();
    const resultProducts = await productsModel.find();

    const listIdBrand = resultBrands.map((brand) => brand._id);

    const brandExits = resultProducts
      .map((product) => product.brand_id)
      .filter((brandId) => listIdBrand.some((id) => id.equals(brandId)));

    res.status(200).json({
      data: resultBrands,
      message: "Get success",
      brandExits,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createBrand = async (req, res) => {
  try {
    const image = await uploadImage(req.file);
    const result = await brandModel.create({
      ...req.body,
      image: { public_id: image.public_id, url: image.url },
    });
    res.status(201).json({
      data: result,
      message: "Created",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateBrand = async (req, res) => {
  const { id, name } = req.body;
  if (!id) {
    res.status(400).json({
      message: "Invalid 'Id'",
    });
  }
  try {
    const brand = await brandModel.findById({ _id: id });
    if (req.file) {
      await cloudinary.uploader.destroy(brand.image.public_id);
      const result = await uploadImage(req.file);
      brand.image = { public_id: result.public_id, url: result.url };
    }
    brand.name = name ?? brand.name;
    await brand.save();
    res.status(201).json({
      data: brand,
      message: "Updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteBrand = async (req, res) => {
  const { brand_id } = req.params;
  try {
    const resultProducts = await productsModel.find();
    const brandRequired = resultProducts.some((pro) =>
      pro.brand_id.equals(brand_id)
    );

    if (!brandRequired) {
      const brand = await brandModel.findById({ _id: brand_id });
      // await cloudinary.uploader.destroy(brand.image.public_id);
      const result = await brandModel.deleteOne({ _id: brand_id });

      res.status(204).json({
        data: result,
        message: "Deleted",
      });
    } else {
      res.status(405).json({
        message: "Brand is Require",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
