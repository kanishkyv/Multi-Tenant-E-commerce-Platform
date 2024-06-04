const Model = require("../models");
const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../utils/exception");

const login = async (email, password) => {
  const tenant = await Model.tenant.findOne({ email });
  if (tenant && (await tenant.matchPassword(password))) {
    const token = jwt.sign({ id: tenant._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    await Model.tenant.findOneAndUpdate({ _id: tenant._id }, { token: token });

    return token;
  } else {
    throw new UnauthorizedError("Invalid email or password");
  }
};
const addCategory = async (name, tenantId) => {
  let category = {
    name,
    tenantId,
  };
  let data = await Model.categories.create(category);
  return data;
};

const addProduct = async (body, tenantId) => {
  body.tenantId = tenantId;
  let product = Model.products(body);
  product = await product.save();
  return product;
};
const getProducts = async (tenantId) => {
  let products = await Model.products.find({ tenantId: tenantId }).limit(10);
  return products;
};
const orderRequest = async (body) => {
  await Model.orders.findOneAndUpdate(
    { _id: body.orderId },
    { status: body.status }
  );
  return;
};

const updateOrderStatus = async (body) => {
  await Model.orders.findOneAndUpdate(
    { _id: body.orderId },
    { status: body.status }
  );
  return;
};
const orderDetails = async (id) => {
  let data = await Model.orders
    .findOne({ _id: id })
    .populate("customer")
    .populate({
      path: "products.productId",
      model: "products",
    });
  return data;
};
const ordersList = async (tenantId, orderStatus, StartDate, EndDate) => {
  let pipeline = [
    {
      $match: { tenantId: tenantId },
    },
  ];
  if (orderStatus) {
    pipeline.unshift({
      $match: { status: orderStatus },
    });
  }
  if (StartDate && EndDate) {
    pipeline.unshift({
      $match: { orderDate: { $gte: EndDate, $gte: StartDate } },
    });
  }
  let data = await Model.orders.aggregate(pipeline);
  return data;
};

module.exports = {
  login,
  addCategory,
  addProduct,
  orderRequest,
  updateOrderStatus,
  orderDetails,
  ordersList,
  getProducts,
};
