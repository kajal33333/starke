const express = require("express");

const router = express.Router();

// Purana galat path hata kar yeh likho:
const manufacturerController = require('../controllers/manufacturersController');

const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// Get All / Single Manufacturer
// ==========================================
router.get(
  "/",
  authMiddleware,
  manufacturerController.getAllManufacturers
);

// ==========================================
// Create Manufacturer
// ==========================================
router.post(
  "/",
  authMiddleware,
  manufacturerController.createManufacturer
);

// ==========================================
// Update Manufacturer
// ==========================================
router.put(
  "/",
  authMiddleware,
  manufacturerController.updateManufacturer
);

// ==========================================
// Delete Manufacturer
// ==========================================
router.delete(
  "/",
  authMiddleware,
  manufacturerController.deleteManufacturer
);

module.exports = router;