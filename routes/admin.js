const express = require("express");
const router = express.Router();

const { adminController } = require("../controllers");
const isAuth = require("../middlewares/auth");

router.post("/signup", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);
router.post("/tenant", isAuth.adminAuth, adminController.addTenant);
router.delete("/tenant/:id", isAuth.adminAuth, adminController.deleteTenant);
router.put("/tenant/:id", isAuth.adminAuth, adminController.updateTenant);

module.exports = router;
