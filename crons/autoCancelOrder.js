const cron = require("node-cron");
const Order = require("../models/orders");
console.log("cron file");
const TIME_LIMIT = 1 * 60 * 1000;

// Function to check and cancel overdue orders
const checkAndCancelOrders = async () => {
  try {
    console.log("cron checking");
    const now = Date.now();
    const overdueOrders = await Order.find({
      status: "PENDING",
      orderDate: { $lt: new Date(now - TIME_LIMIT) },
    });

    for (const order of overdueOrders) {
      order.status = "CANCELLED";
      order.cancelledAt = new Date();
      await order.save();
      console.log(`Order ${order._id} has been automatically canceled.`);
    }
  } catch (error) {
    console.error("Error checking and canceling orders:", error);
  }
};

cron.schedule("* * * * *", checkAndCancelOrders);
