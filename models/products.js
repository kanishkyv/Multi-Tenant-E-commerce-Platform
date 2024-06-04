const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  inventoryCount: { type: Number, required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "tenants" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
});
const Products = mongoose.model("products", productSchema);

module.exports = Products;
