const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const Product = require("./productModel");
const ProductVariant = require("./productVariantModel");

const Drink = Product.discriminator(
  "Drink",
  new mongoose.Schema({
    // variants: [ProductVariant],
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariant",
      },
    ],
  })
);
//https://stackoverflow.com/questions/46870088/how-to-add-different-sizes-of-a-product-in-mongoose-model
//https://stackoverflow.com/questions/35468855/multiple-schema-references-in-single-schema-array-mongoose

module.exports = mongoose.model("Drink");

// const productSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   imageURL: {
//     type: String,
//     required: true,
//   },
//   priceSmall: {
//     type: Number,
//     required: true,
//   },
//   priceMedium: {
//     type: Number,
//     required: true,
//   },
//   priceLarge: {
//     type: Number,
//     required: true,
//   },
//   description: String,
// });

// const Drink = mongoose.model("Drink", productSchema);

// module.exports = Product;
