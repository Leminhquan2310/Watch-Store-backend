const cron = require("node-cron");
const productsModel = require("../Models/products.model");

cron.schedule =
  ("*/5 * * * * ",
  async () => {
    const now = new Date();

    try {
      const result = await productsModel.updateMany(
        {
          discount_expire: { $gt: now },
        },
        { $set: { discount: 0, discount_expire: null } }
      );
      console.log(`Updated ${result.modifiedCount} products - ${new Date()}`);
    } catch (error) {
      console.error("Error updating flash sale:", err);
    }
  });
