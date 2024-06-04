const mongoose = require("mongoose");

const CartModel = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer" },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        qty: { type: Number, default: 1 },
        price: Number,
      },
    ],
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "tenants" },
    totalPrice: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("cart", CartModel);

module.exports = Cart;
