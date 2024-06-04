const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "tenants" },
});
const Category = mongoose.model("categories", categorySchema);

module.exports = Category;
