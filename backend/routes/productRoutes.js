const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// GET ALL / SINGLE PRODUCT
// ==========================================

router.get(
  "/",
  authMiddleware,
  productController.getProducts
);

// ==========================================
// CREATE PRODUCT
// ==========================================

router.post(
  "/",
  authMiddleware,
  productController.createProduct
);

// ==========================================
// UPDATE PRODUCT
// ==========================================

router.put(
  "/",
  authMiddleware,
  productController.updateProduct
);

module.exports = router;