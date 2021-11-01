const express = require("express");
const productController = require("./../controllers/productController");

const router = express.Router();

router.route("/").get(productController.getAllProducts);

// .post(productController.createProduct);
//   .patch(shopController.updateCart)

router.route("/food").post(productController.createFood);

router.route("/drink").post(productController.createDrink);

router.route("/addOn").post(productController.createAddOn);

router
  .route("/:id")
  .get(productController.getProduct)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
