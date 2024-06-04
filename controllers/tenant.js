const {
  login,
  addCategory,
  addProduct,
  getProducts,
  orderRequest,
  updateOrderStatus,
  orderDetails,
  ordersList,
} = require("../services/tenant");

exports.loginTenant = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

exports.addCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const data = await addCategory(name, req.user._id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    const data = await addProduct(req.body, req.user._id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
exports.getProducts = async (req, res, next) => {
  try {
    const data = await getProducts(req.user._id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
exports.orderRequest = async (req, res, next) => {
  try {
    await orderRequest(req.body);
    res.json({ status: 200, Message: `Order is ${req.body.status}` });
  } catch (error) {
    next(error);
  }
};
exports.updateOrderStatus = async (req, res, next) => {
  try {
    await updateOrderStatus(req.body);
    res.json({ status: 200, Message: `Order is ${req.body.status}` });
  } catch (error) {
    next(error);
  }
};
exports.orderDetails = async (req, res, next) => {
  try {
    let data = await orderDetails(req.params.id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
exports.ordersList = async (req, res, next) => {
  try {
    let data = await ordersList(
      req.user._id,
      req.query.orderStatus,
      req.query.StartDate,
      req.query.EndDate
    );
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
