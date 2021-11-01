const Product = require("../models/productModel");
const Drink = require("../models/drinkModel");
const AddOn = require("../models/addOnModel");
const Food = require("../models/foodModel");
const ProductVariant = require("../models/productVariantModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllProducts = catchAsync(async (req, res) => {
  // const drinks = await Product.find({ productType: "drink" });
  // const food = await Product.find({ productType: "food" });
  // const addOns = await Product.find({ productType: "addOn" });
  const products = await Product.find({ active: true }).populate({
    path: "variants",
  });

  res.status(200).json({
    status: "success",
    // results: products.length,
    data: {
      // drinks,
      // food,
      // addOns,
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.createFood = catchAsync(async (req, res) => {
  const newFood = {
    title: req.body.title,
    imageURL: req.body.imageURL,
    description: req.body.description,
    price: req.body.price,
  };

  const food = await Food.create(newFood);

  res.status(200).json({
    status: "success",
    data: {
      food,
    },
  });
});

exports.createDrink = catchAsync(async (req, res) => {
  let requestVariants = req.body.variants;
  // let requestVariantsMap = new Map();

  // requestVariantsMap.set("small", requestVariants.small);

  let variantsToInsert = [];

  for (let property in requestVariants) {
    variantsToInsert.push({
      name: property,
      price: requestVariants[property],
    });
  }

  // variants:
  // { large: "5"
  // medium: "3"
  // small: "1"}

  const productVariantsResult = await ProductVariant.insertMany(
    variantsToInsert
  );

  const productVariantIds = productVariantsResult.map((productVariant) => {
    return productVariant._id;
  });

  const drink = await Drink.create({
    title: req.body.title,
    imageURL: req.body.imageURL,
    description: req.body.description,
    variants: productVariantIds,
  });

  res.status(200).json({
    status: "success",
    data: {
      drink,
    },
  });
});

exports.createAddOn = catchAsync(async (req, res) => {
  // const product = await Product.create(req.body);
  const newAddOn = {
    title: req.body.title,
    imageURL: req.body.imageURL,
    description: req.body.description,
    price: req.body.price,
    type: req.body.type,
  };

  const addOn = await AddOn.create(newAddOn);

  res.status(200).json({
    status: "success",
    data: {
      addOn,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res) => {
  // const requestBodyVariants = req.body.variants;

  let product = await Product.findOne({ _id: req.body._id });

  if (req.body.productType === "Drink") {
    // await ProductVariant.deleteMany({
    //   _id: { $in: product.variants },
    // }); XXXX

    // let variantsToDelete = [];

    // for (let i = 0; i < product.variants.length; ++i) {
    //   let counter = 0;

    //   while (counter < requestBodyVariants.length) {
    //     if (
    //       product.variants[i].toString() === requestBodyVariants[counter]._id
    //     ) {
    //       break;
    //     }

    //     ++counter;
    //   }

    //   if (counter >= requestBodyVariants.length) {
    //     variantsToDelete.push(product.variants[i].toString());
    //   }
    // }

    // product.variants = product.variants.filter((variantId) => {
    //   return !variantsToDelete.includes(variantId.toString());
    // });

    // for (let i = 0; i < requestBodyVariants.length; ++i) {
    //   let requestVariantData = {
    //     name: requestBodyVariants[i].name,
    //     price: requestBodyVariants[i].price,
    //   };

    //   const filter = { _id: requestBodyVariants[i]._id };

    //   if (requestBodyVariants[i]._id) {
    //     //if there's an id
    //     await ProductVariant.findOneAndUpdate(filter, requestVariantData, {
    //       new: true,
    //       upsert: true,
    //     });
    //   } else {
    //     //if there's no id
    //     const insertedVariant = await ProductVariant.create(requestVariantData);

    //     product.variants.push(insertedVariant._id);
    //   }
    // }

    let requestVariants = req.body.variants.map((variant) => {
      return {
        name: variant.name,
        price: variant.price,
      };
    });

    const productVariantsResult = await ProductVariant.insertMany(
      requestVariants
    );
    const productVariantIds = productVariantsResult.map((productVariant) => {
      return productVariant._id;
    });

    product.variants = productVariantIds;
  }

  product.description = req.body.description;
  product.imageURL = req.body.imageURL;
  product.title = req.body.title;

  let updatedProduct = await product.save();

  if (req.body.productType === "Drink") {
    updatedProduct = await updatedProduct.populate({
      path: "variants",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      updatedProduct,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res) => {
  // const { productId } = req.body;

  await Product.findOneAndUpdate(
    // { _id: productId },
    { _id: req.params.id },
    {
      active: false,
    }
  );

  res.status(200).json({
    status: "success",
    // data: {
    //   addOn,
    // },
  });
});
