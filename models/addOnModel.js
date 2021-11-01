const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./productModel");

const AddOn = Product.discriminator(
  "AddOn",
  new mongoose.Schema({
    type: {
      type: String,
      enum: ["food", "drink"],
      required: true,
    },
  })
);

module.exports = mongoose.model("AddOn");

// const foodSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   imageURL: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   description: String,
//   type: {
//     type: String,
//     enum: ["food", "drink"],
//     required: true,
//   },
// });

// const Food = mongoose.model("Food", foodSchema);

// module.exports = Product;
