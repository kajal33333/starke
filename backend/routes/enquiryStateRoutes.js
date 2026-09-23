const express = require("express");
const router = express.Router();
const enquiryStateController = require("../controllers/enquiryStateController");
const authMiddleware = require("../middleware/authMiddleware");

// Get All or Single
router.get("/", authMiddleware, enquiryStateController.getAllEnquiryStates);

// Create
router.post("/", authMiddleware, enquiryStateController.createEnquiryState);

// Update
router.put("/", authMiddleware, enquiryStateController.updateEnquiryState);

// Delete
router.delete("/", authMiddleware, enquiryStateController.deleteEnquiryState);

module.exports = router;
