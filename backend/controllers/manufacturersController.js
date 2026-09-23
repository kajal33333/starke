const Manufacturer = require("../models/manufacturers");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");
const { Op } = require("sequelize");

// Get all or one Manufacturer

exports.getAllManufacturers = asyncHandler(
  async (req, res, next) => {
    const {
      id,
      search,
      q,
      page = 1,
      limit = 10,
      getAll = false,
    } = req.query;

    // ==========================================
    // Get single manufacturer
    // ==========================================

    if (id) {
      const manufacturer =
        await Manufacturer.findByPk(id);

      if (!manufacturer) {
        return next(
          new ErrorHandler(
            "Manufacturer not found",
            404
          )
        );
      }

      return res.status(200).json({
        success: true,
        data: manufacturer,
      });
    }

    // ==========================================
    // Search
    // ==========================================

    const searchValue =
      (search || q || "").trim();

    const where = {};

    if (searchValue) {
      where.name = {
        [Op.like]: `%${searchValue}%`,
      };
    }

    // ==========================================
    // Get all manufacturers
    // ==========================================

    if (
      getAll === "true" ||
      getAll === true
    ) {
      const manufacturers =
        await Manufacturer.findAll({
          where,
          order: [
            ["createdAt", "DESC"],
          ],
        });

      return res.status(200).json({
        success: true,
        data: manufacturers,
      });
    }

    // ==========================================
    // Pagination
    // ==========================================

    const pageNumber =
      parseInt(page) || 1;

    const limitNumber =
      parseInt(limit) || 10;

    const offset =
      (pageNumber - 1) *
      limitNumber;

    const {
      count: totalItems,
      rows: manufacturers,
    } =
      await Manufacturer.findAndCountAll({
        where,
        order: [
          ["createdAt", "DESC"],
        ],
        offset,
        limit: limitNumber,
      });

    const totalPages = Math.ceil(
      totalItems / limitNumber
    );

    return res.status(200).json({
      success: true,
      data: manufacturers,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalItems,
        limit: limitNumber,
      },
    });
  }
);



// Create Manufacturer
exports.createManufacturer = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return next(new ErrorHandler("Name is required", 400));
  }

  const existingManufacturer = await Manufacturer.findOne({
    where: { name: name.trim() },
  });

  if (existingManufacturer) {
    return next(
      new ErrorHandler("Manufacturer name must be unique", 400)
    );
  }

  const manufacturer = await Manufacturer.create({
    name: name.trim(),
  });

  return res.status(201).json({
    success: true,
    message: "Manufacturer created successfully",
    data: manufacturer,
  });
});

// Update Manufacturer
exports.updateManufacturer = asyncHandler(async (req, res, next) => {
  const { id, name } = req.body;

  if (!id) {
    return next(new ErrorHandler("Manufacturer ID is required", 400));
  }

  if (!name || !name.trim()) {
    return next(new ErrorHandler("Name is required for update", 400));
  }

  const manufacturer = await Manufacturer.findByPk(id);

  if (!manufacturer) {
    return next(new ErrorHandler("Manufacturer not found", 404));
  }

  const existingManufacturer = await Manufacturer.findOne({
    where: {
      name: name.trim(),
      id: { [Op.ne]: id },
    },
  });

  if (existingManufacturer) {
    return next(
      new ErrorHandler("Manufacturer name must be unique", 400)
    );
  }

  manufacturer.name = name.trim();
  await manufacturer.save();

  return res.status(200).json({
    success: true,
    message: "Manufacturer updated successfully",
    data: manufacturer,
  });
});

// Delete Manufacturer
exports.deleteManufacturer = asyncHandler(async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return next(new ErrorHandler("Manufacturer ID is required", 400));
  }

  const manufacturer = await Manufacturer.findByPk(id);

  if (!manufacturer) {
    return next(new ErrorHandler("Manufacturer not found", 404));
  }

  await manufacturer.destroy();

  return res.status(200).json({
    success: true,
    message: "Manufacturer deleted successfully",
  });
});