const Product = require("../models/productModel");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const authController = require("./../controllers/authController");
const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY);
// const stripe2 = require("stripe")(process.env.STRIPE_TEST_PUBLISHABLE_KEY);

exports.addToCart = catchAsync(async (req, res) => {
  const decoded = await authController.extractToken(
    req.headers.authorization.split(" ")[1]
  );

  const user = await User.findById(decoded.id);
  const cart = user.cart;

  const requestProduct = req.body.product;
  const requestAddOns = req.body.addOns;
  const requestVariant = req.body.variant;

  cart.push({
    product: requestProduct,
    addOns: requestAddOns,
    variant: requestVariant,
  });

  // let existingProductIndex;
  // if (cart.products.length !== 0) {
  //   existingProductIndex = cart.products.findIndex((item) => {
  //     return item.product == requestProductId;
  //   });
  // } else {
  //   existingProductIndex = -1;
  // }

  // if (existingProductIndex >= 0) {
  //   cart.products[existingProductIndex].qty += 1;
  // } else {
  //   // cart.products = [];
  //   cart.products.push({
  //     product: requestProductId,
  //     qty: 1,
  //   });
  // }

  const result = await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      cart: result.cart,
    },
  });
});

exports.updateCart = catchAsync(async (req, res) => {
  // if (req.body.productQty < 0) {
  //   return next(new AppError("Invalid quantity", 400));
  // }

  const decoded = await authController.extractToken(
    req.headers.authorization.split(" ")[1]
  );

  // const filter = {
  //   id: decoded.id,
  //   "cart.products.product": req.body.productId,
  // };
  // const update = {
  //   $set: {
  //     "cart.products.$.qty": req.body.productQty,
  //   },
  // };

  // const result = await User.findOneAndUpdate(filter, update);

  res.status(200).json({
    status: "success",
    data: {
      // result,
    },
  });
});

exports.deleteItemFromCart = catchAsync(async (req, res) => {
  const decoded = await authController.extractToken(
    req.headers.authorization.split(" ")[1]
  );

  const { cartItemId } = req.body;
  const filter = {
    _id: decoded.id,
  };
  // const update = {
  //   $pull: { "cart.products": { product: cartItemId } },
  // };
  // const update = {
  //   $pull: { cart: { product: cartItemId } },
  // };
  const update = {
    $pull: { cart: { _id: cartItemId } },
  };

  const result = await User.findOneAndUpdate(filter, update);

  res.status(200).json({
    status: "success",
    data: {
      result,
    },
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const decoded = await authController.extractToken(
    req.headers.authorization.split(" ")[1]
  );

  const user = await User.findById(decoded.id).populate({
    path: "cart",
    populate: [{ path: "product" }, { path: "addOns" }, { path: "variant" }],
    // populate: {
    //   // path: "products",
    //   populate: [{ path: "product" }, { path: "addOns" }],
    // },
  });

  // populate({
  //   path: "cart.products.productId",
  // });

  res.status(200).json({
    status: "success",
    data: {
      cart: user.cart,
    },
  });
});

exports.checkout = catchAsync(async (req, res) => {
  // await stripe.charges.create({
  //   amount: 'test * 100',
  //   currency: 'test',
  //   source: 'test',
  //   description: 'test',
  // });

  // var elements = await stripe2.elements();
  // var cardElement = await elements.create("card");

  // const result = await stripe.createPaymentMethod({
  //   type: "card",
  //   card: cardElement,
  //   billing_details: {
  //     name: "Jenny Rosen",
  //   },
  // });

  // const card = await stripe.customers.createSource(
  //   "pm_1Ji477GjIYcUCXhqYlDwjRhn",
  //   {
  //     source: "tok_visa",
  //   }
  // );

  const charge = await stripe.charges.create({
    amount: 2000,
    currency: "usd",
    // source: "pm_1Ji3bPGjIYcUCXhqaPpuRHRz",
    source: "tok_visa",
    description: "My First Test Charge (created for API docs)",
  });
  // https://stripe.com/docs/api/charges/create
  // https://stripe.com/docs/api/cards/create
  // https://stripe.com/docs/api/tokens/create_card
  // console.log(charge);
});
