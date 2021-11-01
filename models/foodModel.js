const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const Product = require("./productModel");

const Food = Product.discriminator("Food", new mongoose.Schema({}));

module.exports = mongoose.model("Food");
