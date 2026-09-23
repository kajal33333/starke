const db = require("../models/index");
const Enquiry_State = db.Enquiry_State;
const asyncHandler = require("../middleware/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");
const { UniqueConstraintError } = require("sequelize");

// Get all or one
exports.getAllEnquiryStates = asyncHandler(async (req, res, next) => {
  const { id, page = 1, limit = 10, getAll = false } = req.query;

  if (id) {
    const state = await Enquiry_State.findByPk(id);
    if (!state) {
      return next(new ErrorHandler("State not found", 404));
    }
    return res.status(200).json({
      success: true,
      data: state,
    });
  } else if (getAll) {
    const state = await Enquiry_State.findAll();
    return res.status(200).json({
      success: true,
      data: state,
    });
  } else {
    const offset = (page - 1) * limit;
    const { count, rows: states } = await Enquiry_State.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
    });
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      success: true,
      data: states,
      pagination: {
        currentPage: parseInt(page),
        totalPages: totalPages,
        totalItems: count,
        limit: parseInt(limit),
      },
    });
  }
});

// Create
exports.createEnquiryState = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new ErrorHandler("Name is required", 400));
  }

  const state = await Enquiry_State.create({ name }).catch((error) => {
    if (error instanceof UniqueConstraintError) {
      return next(new ErrorHandler("State name must be unique", 400));
    }
    return next(error);
  });

  res.status(200).json({
    success: true,
    message: "State created successfully",
    data: state,
  });
});

// Update
exports.updateEnquiryState = asyncHandler(async (req, res, next) => {
  const { id, name } = req.body;

  const state = await Enquiry_State.findByPk(id);
  if (!state) {
    return next(new ErrorHandler("State not found", 404));
  }

  if (!name) {
    return next(new ErrorHandler("Name is required for update", 400));
  }

  state.name = name;
  await state.save().catch((error) => {
    if (error instanceof UniqueConstraintError) {
      return next(new ErrorHandler("State name must be unique", 400));
    }
    return next(error);
  });

  res.status(200).json({
    success: true,
    message: "State updated successfully",
    data: state,
  });
});

// Delete
exports.deleteEnquiryState = asyncHandler(async (req, res, next) => {
  const { id } = req.query;

  const state = await Enquiry_State.findByPk(id);
  if (!state) {
    return next(new ErrorHandler("State not found", 404));
  }

  await state.destroy();

  res.status(200).json({
    success: true,
    message: "State deleted successfully",
  });
});
