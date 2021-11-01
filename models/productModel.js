const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productOptions = {
  discriminatorKey: "productType", // our discriminator key, could be anything
  collection: "products", // the name of our collection
};

// Our Base schema: these properties will be shared with our "real" schemas
const Product = mongoose.model(
  "Product",
  new mongoose.Schema(
    {
      title: { type: String, required: true },
      imageURL: { type: String, required: true },
      price: { type: Number, required: false },
      description: String,
      active: {
        type: Boolean,
        default: true,
      },
    },
    productOptions
  )
);

module.exports = mongoose.model("Product");
// module.exports = Product;
