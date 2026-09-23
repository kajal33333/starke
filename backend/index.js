const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const { sequelize } = require("./config/db");

// Models + associations load
require("./models");

dotenv.config();

const app = express();

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ===============================
// Routes
// ===============================

const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const manufacturersRoutes = require("./routes/manufacturersRoutes");
const modelRoutes = require("./routes/modelRoutes");
const productRoutes = require("./routes/productRoutes");
const permissionsRoutes = require("./routes/permissionsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cityRoutes = require("./routes/cityRoutes");
const enquiryStateRoutes = require("./routes/enquiryStateRoutes");

app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/permissions", permissionsRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/manufacturers", manufacturersRoutes);
app.use("/api/v1/models", modelRoutes);
app.use("/api/v1/cities", cityRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/enquiryState", enquiryStateRoutes);

// ===============================
// Health Check
// ===============================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("✅ MySQL connected successfully");

    await sequelize.sync();

    console.log("✅ MySQL tables synced successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ SERVER START ERROR:");
    console.error(error);
    process.exit(1);
  }
};

startServer();