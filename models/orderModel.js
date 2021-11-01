const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartSchema = require("./cartSchema");

const orderSchema = new mongoose.Schema({
  paymentMethod: {
    type: String,
    enum: ["cash-on-delivery", "card"],
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ["processing", "sent", "delivered"],
    default: "processing",
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "not paid"],
    default: "not paid",
  },
  address: {
    type: String,
  },
  // items: [cartSchema],
  items: [
    {
      product: {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        title: { type: String },
        price: { type: Number },
        imageURL: { type: String },
        type: { type: String },
      },
      addOns: [
        {
          addOnId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AddOn",
          },
          title: { type: String },
          price: { type: Number },
        },
      ],
      variant: {
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductVariant",
        },
        name: String,
        price: { type: Number },
      },
    },
  ],
  cardPaymentMethodDetails: Schema.Types.Mixed,
  grossTotal: {
    type: Number,
  },
  bobaRewardsUsed: {
    type: Number,
  },
  bobaRewardsRate: {
    type: Number,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedAt: { type: Date },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
