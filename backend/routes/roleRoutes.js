const express = require("express");

const router = express.Router();

const roleController = require("../controllers/roleController");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// Get All Roles / Get Role By ID
// ==========================================
router.get(
  "/",
  authMiddleware,
  roleController.getAllRoles
);

// ==========================================
// Create Role
// ==========================================
router.post(
  "/",
  authMiddleware,
  roleController.createRole
);

// ==========================================
// Update Role
// ==========================================
router.put(
  "/",
  authMiddleware,
  roleController.updateRole
);

// ==========================================
// Delete Role
// ==========================================
router.delete(
  "/",
  authMiddleware,
  roleController.deleteRole
);

module.exports = router;