const mongoose = require("mongoose");
// const autoIncrement = require("mongoose-auto-increment");
let Product = require("./products");

const orderSchema = new mongoose.Schema({
  orderNo: { type: Number, default: 4001 },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "customers" },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    default: "PENDING",
    enum: [
      "PENDING",
      "CANCELLED",
      "REJECTED",
      "ONGOING",
      "OUTOFDELIVERY",
      "COMPLETED",
      "ACCEPTED",
    ],
  },
  orderDate: { type: Date, default: Date.now },
  cancelledAt: { type: Date },
  acceptedAt: { type: Date },
  rejectedAt: { type: Date },
  acceptedAt: { type: Date },
  ongoingAt: { type: Date },
  outofDeliveryAt: { type: Date },
  completedAt: { type: Date },

  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "tenants" },

  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      price: Number,
    },
  ],
});

async function updateInventory(order) {
  for (const item of order.products) {
    await Product.findByIdAndUpdate(
      item.productId,
      {
        $inc: {
          inventory:
            order.status === "ACCEPTED" ? -item.quantity : item.quantity,
        },
      },
      { new: true }
    );
  }
}

orderSchema.statics.getNextOrderNumber = async function () {
  const lastOrder = await this.findOne().sort("-orderNo");
  return lastOrder ? lastOrder.orderNo + 1 : 4001;
};

orderSchema.pre("save", async function (next) {
  if (this.isNew && this.status === "PENDING") {
    // await updateInventory(this);
  }
  next();
});

orderSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const currentStatus = update.status;

  if (!currentStatus) return next();

  const dateFields = {
    CANCELLED: "cancelledAt",
    REJECTED: "rejectedAt",
    ONGOING: "ongoingAt",
    ACCEPTED: "acceptedAt",
    OUTOFDELIVERY: "outofDeliveryAt",
    COMPLETED: "completedAt",
  };

  const dateField = dateFields[currentStatus];
  if (dateField) {
    update[dateField] = new Date();
  }

  if (currentStatus === "ACCEPTED" || currentStatus === "CANCELLED")
    // await updateInventory(this);

    next();
});
const Orders = mongoose.model("orders", orderSchema);

module.exports = Orders;
