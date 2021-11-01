const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const poroductVariantSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["small", "medium", "large"],
  }, // If you're certain this will only ever be sizes, you could make it an enum
  price: Number,
});

const ProductVariant = mongoose.model("ProductVariant", poroductVariantSchema);

// module.exports = ProductVariant;

// module.exports = poroductVariantSchema;
module.exports = ProductVariant;
