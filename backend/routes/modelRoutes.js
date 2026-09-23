const express = require("express");

const router = express.Router();

const modelController = require("../controllers/modelController");

const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// Get All / Single Models
// ==========================================

router.get(
  "/",
  authMiddleware,
  modelController.getAllModels
);

// ==========================================
// Create Model
// ==========================================

router.post(
  "/",
  authMiddleware,
  modelController.createModel
);

// ==========================================
// Update Model
// ==========================================

router.put(
  "/",
  authMiddleware,
  modelController.updateModel
);

// ==========================================
// Delete Model
// ==========================================

router.delete(
  "/",
  authMiddleware,
  modelController.deleteModel
);

module.exports = router;