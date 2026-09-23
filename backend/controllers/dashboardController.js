const Manufacturer = require("../models/manufacturers");
const Model = require("../models/model");
const Product = require("../models/product");

exports.getDashboardCounts = async (req, res) => {
  try {
    const [manufacturers, models, products] = await Promise.all([
      Manufacturer.count(),
      Model.count(),
      Product.count(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        manufacturers,
        models,
        products,
      },
    });
  } catch (error) {
    console.error("Dashboard counts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard counts",
      error: error.message,
    });
  }
};