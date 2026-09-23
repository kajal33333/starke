const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Role = require("../models/Role");

const register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      contact,
      password,
      company_name,
      address,
      state,
      city,
      zipcode,
      role_id,
      isAdmin,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !contact ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "first_name, last_name, email, contact and password are required",
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    if (role_id) {
      const role = await Role.findByPk(role_id);

      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Invalid role_id",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email,
      contact,
      password: hashedPassword,
      company_name: company_name || null,
      address: address || null,
      state: state || null,
      city: city || null,
      zipcode: zipcode || null,
      role_id: role_id || null,
      isAdmin: Boolean(isAdmin),
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "role",
          required: false,
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const userResponse = user.toJSON();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const { id, q, getAll } = req.query;

    if (id) {
      const user = await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: "role",
            required: false,
          },
        ],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const userResponse = user.toJSON();
      delete userResponse.password;

      return res.status(200).json({
        success: true,
        data: {
          user: userResponse,
        },
      });
    }

    const where = {};

    if (q && q.trim()) {
      const search = q.trim();

      where[Op.or] = [
        {
          first_name: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          last_name: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          contact: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          company_name: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          state: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          city: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          zipcode: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }

    if (getAll === "true") {
      const users = await User.findAll({
        where,
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Role,
            as: "role",
            required: false,
            attributes: ["id", "role_name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        success: true,
        data: users,
      });
    }

    const page = Math.max(
      Number.parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.max(
      Number.parseInt(req.query.limit, 10) || 10,
      1
    );

    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where,

      attributes: {
        exclude: ["password"],
      },

      include: [
        {
          model: Role,
          as: "role",
          required: false,
          attributes: ["id", "role_name"],
        },
      ],

      limit,
      offset,

      order: [["createdAt", "DESC"]],

      distinct: true,
    });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        currentPage: page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      first_name,
      last_name,
      email,
      contact,
      password,
      company_name,
      address,
      state,
      city,
      zipcode,
      role_id,
      isAdmin,
    } = req.body;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        where: {
          email,
          id: {
            [Op.ne]: id,
          },
        },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    if (role_id) {
      const role = await Role.findByPk(role_id);

      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Invalid role_id",
        });
      }
    }

    const updateData = {
      first_name,
      last_name,
      email,
      contact,
      company_name: company_name || null,
      address: address || null,
      state: state || null,
      city: city || null,
      zipcode: zipcode || null,
      role_id: role_id || null,
      isAdmin: Boolean(isAdmin),
    };

    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(
        password,
        10
      );
    }

    await user.update(updateData);

    const updatedUser = await User.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Role,
          as: "role",
          required: false,
          attributes: ["id", "role_name"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUsers,
  updateUser,
  deleteUser,
};