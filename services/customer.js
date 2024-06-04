const Model = require("../models");
const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../utils/exception");
const mongoose = require("mongoose");

const registerCustomer = async (body) => {
  let check = await Model.customers.findOne({ email: body.email });
  if (check) throw new Error("Customer Exists");
  let location;
  if (body.longitude && body.latitude) {
    location = {
      type: "Point",
      coordinates: [+body.longitude, body.latitude],
    };
  }
  const customer = new Model.customers({
    email: body.email,
    password: body.password,
    name: body.name,
    location,
  });
  await customer.save();
  const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  await Model.customers.findOneAndUpdate(
    { _id: customer._id },
    { token: token }
  );
  return token;
};

const loginCustomer = async (email, password) => {
  const customer = await Model.customers.findOne({ email });
  if (customer && (await customer.matchPassword(password))) {
    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    await Model.customers.findOneAndUpdate(
      { _id: customer._id },
      { token: token }
    );

    return token;
  } else {
    throw new UnauthorizedError("Invalid email or password");
  }
};

const logoutCustomer = async (customerId) => {
  await Model.customers.findOneAndUpdate({ _id: customerId }, { token: "" });
};

const homepage = async (longitude, latitude, search, categoryId) => {
  let pipeline = [
    {
      $lookup: {
        from: "tenants",
        let: { tenantId: "$tenantId" },
        pipeline: [
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [Number(longitude), Number(latitude)],
              },
              key: "location",
              spherical: true,
              distanceField: "distance",

              distanceMultiplier: 0.001,
            },
          },
          {
            $addFields: {
              insideRadius: { $gt: ["$radius", "$distance"] },
            },
          },
          {
            $match: { insideRadius: true },
          },

          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", "$$tenantId"] }],
              },
            },
          },
        ],
        as: "tenant",
      },
    },

    {
      $unwind: "$tenant",
    },

    {
      $project: {
        name: 1,
        price: 1,
        "tenant.distance": 1,
        "tenant.radius": 1,
        "tenant.insideRadius": 1,
      },
    },
    {
      $limit: 10,
    },
  ];

  if (search) {
    pipeline.unshift({
      $match: {
        $or: [
          { name: { $regex: search, $options: "i" } },
          //   { field2: { $regex: search, $options: "i" } },
        ],
      },
    });
  }
  if (categoryId) {
    pipeline.unshift({
      $match: {
        category: new mongoose.Types.ObjectId(categoryId),
      },
    });
  }

  const products = await Model.products.aggregate(pipeline);

  return products;
};

const addToCart = async (body, customerId) => {
  await Model.cart.deleteMany({ customerId: customerId });
  body.totalPrice = body.products.reduce((accumulator, item) => {
    return accumulator + item.price * item.qty;
  }, 0);

  body.customerId = customerId;

  const cart = new Model.cart(body);
  await cart.save();

  return cart;
};

const clearCart = async (customerId) => {
  await Model.cart.findOneAndDelete({ customerId: customerId });
};

const placeOrder = async (customerId) => {
  let cartData = await Model.cart.findOne({ customerId: customerId });
  if (!cartData) throw new Error("First Add to Cart");
  let orderModel = {
    customer: cartData.customerId,
    totalAmount: cartData.totalPrice,
    tenantId: cartData.tenantId,
    products: cartData.products,
  };
  let order = new Model.orders(orderModel);
  await order.save();
  await Model.cart.findOneAndDelete({ customerId: customerId });
  return order;
};
const orderDetail = async (id, customerId) => {
  let data = await Model.orders.findOne({ _id: id, customer: customerId });
  return data;
};
const listOrders = async (customerId) => {
  let data = await Model.orders.find({ customer: customerId }).limit(10);
  return data;
};

module.exports = {
  registerCustomer,
  loginCustomer,
  homepage,
  addToCart,
  clearCart,
  placeOrder,
  orderDetail,
  listOrders,
  logoutCustomer,
};
