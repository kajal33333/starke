const Role = require("../models/Role");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");
const { Op } = require("sequelize");

// ============================================================
// GET ALL ROLES / SINGLE ROLE
// ============================================================

exports.getAllRoles = asyncHandler(async (req, res, next) => {
  const {
    id,
    page = 1,
    limit = 10,
    getAll = false,
    q,
  } = req.query;

  // ==========================================================
  // GET SINGLE ROLE
  // ==========================================================

  if (id) {
    const role = await Role.findByPk(id);

    if (!role) {
      return next(
        new ErrorHandler("Role not found", 404)
      );
    }

    return res.status(200).json({
      success: true,
      data: role,
    });
  }

  // ==========================================================
  // SEARCH
  // ==========================================================

  const where = {};

  if (q && q.trim()) {
    where.role_name = {
      [Op.like]: `%${q.trim()}%`,
    };
  }

  // ==========================================================
  // GET ALL WITHOUT PAGINATION
  // ==========================================================

  if (
    getAll === "true" ||
    getAll === true
  ) {
    const roles = await Role.findAll({
      where,

      order: [
        ["createdAt", "DESC"],
      ],
    });

    return res.status(200).json({
      success: true,
      data: roles,
    });
  }

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const currentPage = Math.max(
    parseInt(page, 10) || 1,
    1
  );

  const pageLimit = Math.max(
    parseInt(limit, 10) || 10,
    1
  );

  const offset =
    (currentPage - 1) * pageLimit;

  const {
    rows: roles,
    count: totalItems,
  } = await Role.findAndCountAll({
    where,

    order: [
      ["createdAt", "DESC"],
    ],

    offset,
    limit: pageLimit,
  });

  const totalPages = Math.ceil(
    totalItems / pageLimit
  );

  return res.status(200).json({
    success: true,

    data: roles,

    pagination: {
      currentPage,
      totalPages,
      totalItems,
      limit: pageLimit,
    },
  });
});


// ============================================================
// CREATE ROLE
// ============================================================

exports.createRole = asyncHandler(
  async (req, res, next) => {
    const {
      role_name,
      description,
    } = req.body;

    if (
      !role_name ||
      !role_name.trim()
    ) {
      return next(
        new ErrorHandler(
          "Role name is required",
          400
        )
      );
    }

    const normalizedRoleName =
      role_name.trim();

    // Check duplicate role
    const existingRole =
      await Role.findOne({
        where: {
          role_name: {
            [Op.like]:
              normalizedRoleName,
          },
        },
      });

    if (existingRole) {
      return next(
        new ErrorHandler(
          "Role name must be unique",
          400
        )
      );
    }

    const role =
      await Role.create({
        role_name:
          normalizedRoleName,

        description:
          description
            ? description.trim()
            : null,
      });

    return res.status(201).json({
      success: true,
      message:
        "Role created successfully",
      data: role,
    });
  }
);


// ============================================================
// UPDATE ROLE
// ============================================================

exports.updateRole = asyncHandler(
  async (req, res, next) => {
    const {
      id,
      role_name,
      description,
    } = req.body;

    if (!id) {
      return next(
        new ErrorHandler(
          "Role ID is required",
          400
        )
      );
    }

    if (
      !role_name ||
      !role_name.trim()
    ) {
      return next(
        new ErrorHandler(
          "Role name is required for update",
          400
        )
      );
    }

    const role =
      await Role.findByPk(id);

    if (!role) {
      return next(
        new ErrorHandler(
          "Role not found",
          404
        )
      );
    }

    const normalizedRoleName =
      role_name.trim();

    // Check duplicate except current role
    const duplicateRole =
      await Role.findOne({
        where: {
          role_name: {
            [Op.like]:
              normalizedRoleName,
          },

          id: {
            [Op.ne]: id,
          },
        },
      });

    if (duplicateRole) {
      return next(
        new ErrorHandler(
          "Role name must be unique",
          400
        )
      );
    }

    role.role_name =
      normalizedRoleName;

    role.description =
      description
        ? description.trim()
        : null;

    await role.save();

    return res.status(200).json({
      success: true,
      message:
        "Role updated successfully",
      data: role,
    });
  }
);


// ============================================================
// DELETE ROLE
// ============================================================

exports.deleteRole = asyncHandler(
  async (req, res, next) => {
    const { id } = req.query;

    if (!id) {
      return next(
        new ErrorHandler(
          "Role ID is required",
          400
        )
      );
    }

    const role =
      await Role.findByPk(id);

    if (!role) {
      return next(
        new ErrorHandler(
          "Role not found",
          404
        )
      );
    }

    await role.destroy();

    return res.status(200).json({
      success: true,
      message:
        "Role deleted successfully",
    });
  }
);