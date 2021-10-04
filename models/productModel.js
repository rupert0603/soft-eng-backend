const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  price: Number,
  description: String,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
