const express = require("express");
const orderController = require("./../controllers/orderController");

const router = express.Router();

router
  .route("/")
  .get(orderController.getAllOrders)
  .post(orderController.createdOrder)
  .patch(orderController.patchOrder);

router.route("/user").get(orderController.getUserOrders);

module.exports = router;
