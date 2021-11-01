const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  addOns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AddOn",
    },
  ],
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariant",
  },
  // {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Product",
  // },
});

module.exports = cartSchema;
