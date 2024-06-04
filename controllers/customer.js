const {
  registerCustomer,
  loginCustomer,
  homepage,
  clearCart,
  addToCart,
  placeOrder,
  orderDetail,
  listOrders,
  logoutCustomer,
} = require("../services/customer");

module.exports = {
  registerCustomer: async (req, res, next) => {
    try {
      const data = await registerCustomer(req.body);
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  },

  loginCustomer: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const token = await loginCustomer(email, password);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  },
  logoutCustomer: async (req, res, next) => {
    try {
      await logoutCustomer(req.user._id);
      res.json({ status: 200, message: "You have logged Out" });
    } catch (error) {
      next(error);
    }
  },

  homepage: async (req, res, next) => {
    try {
      const products = await homepage(
        req.user.location.coordinates[0],
        req.user.location.coordinates[1],
        req.query.search,
        req.query.categoryId
      );
      res.json({ products });
    } catch (error) {
      next(error);
    }
  },
  addToCart: async (req, res, next) => {
    try {
      const cartData = await addToCart(req.body, req.user._id);
      res.json({ cartData });
    } catch (error) {
      next(error);
    }
  },
  clearCart: async (req, res, next) => {
    try {
      await clearCart(req.user._id);
      res.json({ status: 200, message: "Cart Deleted" });
    } catch (error) {
      next(error);
    }
  },
  placeOrder: async (req, res, next) => {
    try {
      const orderData = await placeOrder(req.user._id);
      res.json({ orderData });
    } catch (error) {
      next(error);
    }
  },
  orderDetail: async (req, res, next) => {
    try {
      const orderData = await orderDetail(req.params.id, req.user._id);
      res.json({ orderData });
    } catch (error) {
      next(error);
    }
  },
  listOrders: async (req, res, next) => {
    try {
      const orderData = await listOrders(req.user._id);
      res.json({ orderData });
    } catch (error) {
      next(error);
    }
  },
};
