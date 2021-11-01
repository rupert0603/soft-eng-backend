const Product = require("../models/productModel");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const authController = require("./../controllers/authController");
const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY);
const Order = require("../models/orderModel");
const { getFinalPrice, getCartTotalPrice } = require("../globals/helpers");

function createOrderItems(cart) {
  const orderItems = cart.map((cartItem) => {
    return {
      product: {
        productId: cartItem.product._id,
        title: cartItem.product.title,
        price:
          "variants" in cartItem.product
            ? cartItem.variant.price
            : cartItem.product.price, //can be changed to cartItem.product.productType !== Drink
        imageURL: cartItem.product.imageURL,
        type: cartItem.product.productType,
      },
      addOns: cartItem.addOns.map((addOn) => {
        return {
          addOnId: addOn._id,
          title: addOn.title,
          price: addOn.price,
        };
      }),
      variant:
        "variants" in cartItem.product
          ? {
              variantId: cartItem.variant._id,
              name: cartItem.variant.name,
              price: cartItem.variant.price,
            }
          : null,
    };
  });

  return orderItems;
}

function calculateBobaPointsInput(
  inputValue,
  cartTotalPrice,
  userExistingBobaRewards
) {
  if (inputValue <= 0) {
    return 0;
  }

  if (inputValue <= cartTotalPrice) {
    if (inputValue <= userExistingBobaRewards) {
      return inputValue;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

exports.createdOrder = catchAsync(async (req, res) => {
  const decoded = await authController.extractToken(
    req.headers.authorization.split(" ")[1]
  );

  const user = await User.findById(decoded.id).populate({
    path: "cart",
    populate: [{ path: "product" }, { path: "addOns" }, { path: "variant" }],
  });
  const cart = user.cart;

  let grossTotal = getCartTotalPrice(cart, getFinalPrice);
  const bobaRewardsUsed = calculateBobaPointsInput(
    req.body.bobaRewardsUsed,
    grossTotal,
    user.bobaRewards
  );

  const newOrderItems = createOrderItems(cart);

  const newOrder = {
    paymentMethod: req.body.paymentMethod,
    address: req.body.address,
    items: newOrderItems,
    bobaRewardsUsed: bobaRewardsUsed,
    grossTotal,
    createdBy: user._id,
    bobaRewardsRate: process.env.BOBA_REWARDS_RATE,
  };

  // const newOrder = {
  //   paymentMethod: req.body.paymentMethod,
  //   address: req.body.address,
  //   items: cart,
  //   total,
  //   createdBy: user._id,
  // };

  if (req.body.cardPaymentMethodDetails) {
    newOrder.cardPaymentMethodDetails = req.body.cardPaymentMethodDetails;
    newOrder.paymentStatus = "paid";
  }

  const order = await Order.create(newOrder);

  // user.bobaRewards = user.bobaRewards + (process.env.BOBA_REWARDS_RATE *
  user.set("cart", undefined, { strict: false });
  // //   await delete user._doc.cart;

  // //   user.cart = [];
  user.bobaRewards =
    user.bobaRewards -
    bobaRewardsUsed +
    grossTotal * process.env.BOBA_REWARDS_RATE;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      order,
      // cart,
    },
  });
});

exports.getUserOrders = catchAsync(async (req, res) => {
  const decoded = await authController.extractToken(
    req.headers.authorization.split(" ")[1]
  );

  const user = await User.findById(decoded.id);

  const orders = await Order.find({ createdBy: user._id }).sort("-createdAt");
  // .populate({
  //   path: "items",
  //   populate: [{ path: "product" }, { path: "addOns" }, { path: "variant" }],
  // });

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.patchOrder = catchAsync(async (req, res) => {
  const filter = {
    _id: req.body.orderId,
  };

  const update = {
    ...req.body.patchData,
  };

  const result = await Order.findOneAndUpdate(filter, update);

  res.status(200).json({
    status: "success",
    // results: orders.length,
    data: {
      // orders,
    },
  });
});

exports.getAllOrders = catchAsync(async (req, res) => {
  const orders = await Order.find()
    .sort("-createdAt")
    // .populate({
    //   path: "items",
    //   populate: [{ path: "product" }, { path: "addOns" }, { path: "variant" }],
    // })
    .populate("createdBy");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});
