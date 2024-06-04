const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/auth");

const { customerController } = require("../controllers");

router.post("/signup", customerController.registerCustomer);
router.post("/login", customerController.loginCustomer);
router.post("/logout", customerController.logoutCustomer);
router.get("/homepage", isAuth.customerAuth, customerController.homepage);
router.post("/cart", isAuth.customerAuth, customerController.addToCart);
router.delete("/cart", isAuth.customerAuth, customerController.clearCart);
router.post("/order", isAuth.customerAuth, customerController.placeOrder);
router.get("/order/:id", isAuth.customerAuth, customerController.orderDetail);
router.get("/orders", isAuth.customerAuth, customerController.listOrders);

module.exports = router;
