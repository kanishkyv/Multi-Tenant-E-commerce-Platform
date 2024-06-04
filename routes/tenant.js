const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/auth");

const { tenantController } = require("../controllers");

router.post("/login", tenantController.loginTenant);
router.post("/category", isAuth.tenantAuth, tenantController.addCategory);
router.get("/products", isAuth.tenantAuth, tenantController.getProducts);
router.post("/product", isAuth.tenantAuth, tenantController.addProduct);

router.get(
  "/orderDetails/:id",
  isAuth.tenantAuth,
  tenantController.orderDetails
);
router.get("/orders", isAuth.tenantAuth, tenantController.ordersList);
router.post("/orderRequest", isAuth.tenantAuth, tenantController.orderRequest); // Accept/Reject Order
router.post(
  "/orderStatusUpdate",
  isAuth.tenantAuth,
  tenantController.updateOrderStatus
);

module.exports = router;
