
const express = require("express");

const router = express.Router();

const permissionsController = require("../controllers/permissionsController");

// ==========================================
// Get Sidebar
// ==========================================
router.get(
  "/sidebar",
  permissionsController.getSidebar
);

module.exports = router;

