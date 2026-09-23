const Model = require("../models/model");
const Manufacturer = require("../models/manufacturers");

const asyncHandler = require("../middleware/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");

const { Op } = require("sequelize");

// ==========================================
// Get all or one Model
// ==========================================

exports.getAllModels = asyncHandler(async (req, res, next) => {
  const {
    id,
    manufacturerId,
    search,
    q,
    page = 1,
    limit = 10,
    getAll = false,
  } = req.query;

  // ==========================================
  // Get single model
  // ==========================================

  if (id) {
    const model = await Model.findByPk(id);

    if (!model) {
      return next(
        new ErrorHandler("Model not found", 404)
      );
    }

    return res.status(200).json({
      success: true,
      data: model,
    });
  }

  // ==========================================
  // Where condition
  // ==========================================

  const where = {};

  // Manufacturer filter
  if (manufacturerId) {
    where.manufacturerId = manufacturerId;
  }

  // Search by model name
  const searchValue = (search || q || "").trim();

  if (searchValue) {
    where.name = {
      [Op.like]: `%${searchValue}%`,
    };
  }

  // ==========================================
  // Get all models
  // ==========================================

  if (getAll === "true" || getAll === true) {
    const models = await Model.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: models,
    });
  }

  // ==========================================
  // Pagination
  // ==========================================

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;

  const offset =
    (pageNumber - 1) * limitNumber;

  const {
    count: totalItems,
    rows: models,
  } = await Model.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    offset,
    limit: limitNumber,
  });

  const totalPages = Math.ceil(
    totalItems / limitNumber
  );

  return res.status(200).json({
    success: true,
    data: models,
    pagination: {
      currentPage: pageNumber,
      totalPages,
      totalItems,
      limit: limitNumber,
    },
  });
});

// ==========================================
// Create Model
// ==========================================

exports.createModel = asyncHandler(async (req, res, next) => {
  const { name, manufacturerId } = req.body;

  // ==========================================
  // Validate name
  // ==========================================

  if (!name || !name.trim()) {
    return next(
      new ErrorHandler("Model name is required", 400)
    );
  }

  // ==========================================
  // Validate manufacturerId
  // ==========================================

  if (!manufacturerId) {
    return next(
      new ErrorHandler(
        "Manufacturer ID is required",
        400
      )
    );
  }

  // ==========================================
  // Check manufacturer exists
  // ==========================================

  const manufacturer = await Manufacturer.findByPk(
    manufacturerId
  );

  if (!manufacturer) {
    return next(
      new ErrorHandler(
        "Manufacturer not found",
        404
      )
    );
  }

  // ==========================================
  // Check duplicate model
  // Same model name under same manufacturer
  // ==========================================

  const existingModel = await Model.findOne({
    where: {
      name: name.trim(),
      manufacturerId: manufacturerId,
    },
  });

  if (existingModel) {
    return next(
      new ErrorHandler(
        "Model name already exists for this manufacturer",
        400
      )
    );
  }

  // ==========================================
  // Create
  // ==========================================

  const model = await Model.create({
    name: name.trim(),
    manufacturerId: manufacturerId,
  });

  return res.status(201).json({
    success: true,
    message: "Model created successfully",
    data: model,
  });
});

// ==========================================
// Update Model
// ==========================================

exports.updateModel = asyncHandler(async (req, res, next) => {
  const {
    id,
    name,
    manufacturerId,
  } = req.body;

  // ==========================================
  // Validate ID
  // ==========================================

  if (!id) {
    return next(
      new ErrorHandler(
        "Model ID is required",
        400
      )
    );
  }

  // ==========================================
  // Validate name
  // ==========================================

  if (!name || !name.trim()) {
    return next(
      new ErrorHandler(
        "Model name is required for update",
        400
      )
    );
  }

  // ==========================================
  // Validate manufacturer
  // ==========================================

  if (!manufacturerId) {
    return next(
      new ErrorHandler(
        "Manufacturer ID is required",
        400
      )
    );
  }

  // ==========================================
  // Find model
  // ==========================================

  const model = await Model.findByPk(id);

  if (!model) {
    return next(
      new ErrorHandler(
        "Model not found",
        404
      )
    );
  }

  // ==========================================
  // Check manufacturer exists
  // ==========================================

  const manufacturer = await Manufacturer.findByPk(
    manufacturerId
  );

  if (!manufacturer) {
    return next(
      new ErrorHandler(
        "Manufacturer not found",
        404
      )
    );
  }

  // ==========================================
  // Check duplicate
  // Exclude current model
  // ==========================================

  const existingModel = await Model.findOne({
    where: {
      name: name.trim(),

      manufacturerId: manufacturerId,

      id: {
        [Op.ne]: id,
      },
    },
  });

  if (existingModel) {
    return next(
      new ErrorHandler(
        "Model name already exists for this manufacturer",
        400
      )
    );
  }

  // ==========================================
  // Update
  // ==========================================

  model.name = name.trim();
  model.manufacturerId = manufacturerId;

  await model.save();

  return res.status(200).json({
    success: true,
    message: "Model updated successfully",
    data: model,
  });
});

// ==========================================
// Delete Model
// ==========================================

exports.deleteModel = asyncHandler(async (req, res, next) => {
  const { id } = req.query;

  // ==========================================
  // Validate ID
  // ==========================================

  if (!id) {
    return next(
      new ErrorHandler(
        "Model ID is required",
        400
      )
    );
  }

  // ==========================================
  // Find model
  // ==========================================

  const model = await Model.findByPk(id);

  if (!model) {
    return next(
      new ErrorHandler(
        "Model not found",
        404
      )
    );
  }

  // ==========================================
  // Delete
  // ==========================================

  await model.destroy();

  return res.status(200).json({
    success: true,
    message: "Model deleted successfully",
  });
});