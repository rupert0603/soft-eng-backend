const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Product = require("../models/productModel");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please tell us your first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please tell us your last name"],
  },
  middleName: {
    type: String,
  },
  email: {
    type: String,
    required: ["Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    // minlength: 8,
    select: false, //to not appear in the output
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      ///this works on CREATE and SAVE!!!, not update (find by id and update - check 15. 7:00)
      validator: function (el) {
        return el === this.password; //will only work on save like in tour custom validator
      },
      message: "Passwords are not the same!",
    },
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: Number,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.addToCart = async function (productId) {
  const product = await Product.findById(productId);
  if (product) {
    const cart = this.cart;
    const isExisting = cart.items.findIndex(
      (objInItems) =>
        new String(objInItems.productId).trim() ===
        new String(product._id).trim()
    );
    if (isExisting >= 0) {
      cart.items[isExisting].qty += 1;
    } else {
      cart.items.push({ productId: product._id, qty: 1 });
    }
    if (!cart.totalPrice) {
      cart.totalPrice = 0;
    }
    cart.totalPrice += product.price;
    return this.save();
  }
};

userSchema.methods.removeFromCart = function (productId) {
  const cart = this.cart;
  const isExisting = cart.items.findIndex(
    (objInItems) =>
      new String(objInItems.productId).trim() === new String(productId).trim()
  );
  if (isExisting >= 0) {
    cart.items.splice(isExisting, 1);
    return this.save();
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
