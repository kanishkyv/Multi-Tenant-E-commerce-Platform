const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const helmet = require("helmet");

dotenv.config();
connectDB();

const routes = require("./routes/index");
const UnauthorizedError = require("./utils/exception");
const autoCancelOrder = require("./crons/autoCancelOrder");
autoCancelOrder;

const app = express();
app.use(express.json());
app.use(helmet());

app.use("/api/tenant", routes.tenantRoutes);
app.use("/api/admin", routes.adminRoutes);
app.use("/api/customer", routes.customerRoutes);

app.use((err, req, res, next) => {
  console.error("stack", err.stack); // Log the error stack to the console
  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).json({ error: err });
  }

  res.status(err.status || 500); // Set the response status code
  res.json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server started at ${PORT}`));
