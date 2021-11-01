const express = require("express");
const shopController = require("./../controllers/shopController");

const router = express.Router();

router
  .route("/cart")
  .get(shopController.getCart)
  .post(shopController.addToCart)
  .patch(shopController.updateCart)
  .delete(shopController.deleteItemFromCart);

router.route("/checkout").post(shopController.checkout);
// router.post("/addToCart", shopController.addToCart);
// router.patch("/updateCart", shopController.updateCart);
// router.delete("/deleteItomFromCart", shopController.deleteItemFromCart);
// router.get("/getCart", shopController.getCart);

module.exports = router;
