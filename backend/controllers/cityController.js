const db = require("../models/index");

const City = db.City;
const { Op, Sequelize } = require("sequelize");
const ErrorHandler = require("../utils/errorHandler");

// ===============================
// Create a new city
// ===============================
exports.createCity = async (req, res, next) => {
  try {
    const { name, state_id } = req.body;

    const newCity = await City.create({
      name,
      state_id,
    });

    res.status(201).json({
      success: true,
      message: "City created successfully",
      data: newCity,
    });
  } catch (error) {
    console.error("Create City Error:", error);

    return next(
      new ErrorHandler("Not able to create City", 500)
    );
  }
};

// ===============================
// Get city by ID
// ===============================
exports.getCityById = async (req, res, next) => {
  try {
    const cityId = req.params.id;

    const city = await City.findByPk(cityId, {
      include: [
        {
          model: db.Enquiry_State,
          as: "stateInfo",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!city) {
      return next(
        new ErrorHandler("City not found", 404)
      );
    }

    res.status(200).json({
      success: true,
      data: city,
    });
  } catch (error) {
    console.error("Get City Error:", error);

    return next(
      new ErrorHandler("Not able to fetch City", 500)
    );
  }
};

// ===============================
// Update city by ID
// ===============================
exports.updateCity = async (req, res, next) => {
  try {
    const cityId = req.params.id;
    const { name, state_id } = req.body;

    const city = await City.findByPk(cityId);

    if (!city) {
      return next(
        new ErrorHandler("City not found", 404)
      );
    }

    if (name !== undefined) {
      city.name = name;
    }

    if (state_id !== undefined) {
      city.state_id = state_id;
    }

    await city.save();

    res.status(200).json({
      success: true,
      message: "City updated successfully",
      data: city,
    });
  } catch (error) {
    console.error("Update City Error:", error);

    return next(
      new ErrorHandler("Not able to update City", 500)
    );
  }
};

// ===============================
// Delete city by ID
// ===============================
exports.deleteCity = async (req, res, next) => {
  try {
    const cityId = req.params.id;

    const city = await City.findByPk(cityId);

    if (!city) {
      return next(
        new ErrorHandler("City not found", 404)
      );
    }

    await city.destroy();

    res.status(200).json({
      success: true,
      message: "City deleted successfully",
    });
  } catch (error) {
    console.error("Delete City Error:", error);

    return next(
      new ErrorHandler("Not able to delete City", 500)
    );
  }
};


// ===============================
// Get all cities with search
// ===============================
exports.getAllCities = async (req, res, next) => {
  try {
    const { search = "" } = req.query;

    const searchValue = String(search).trim();

    const cities = await City.findAll({
      where: {
        name: {
          [Op.like]: `%${searchValue}%`,
        },
      },

      include: [
        {
          model: db.Enquiry_State,
          as: "stateInfo",
          attributes: ["id", "name"],
        },
      ],

      limit: 10,

      order: [
        [
          Sequelize.literal(`
            CASE
              WHEN \`cities\`.\`name\` LIKE '${searchValue.replace(
                /'/g,
                "''"
              )}%'
              THEN 0
              ELSE 1
            END
          `),
          "ASC",
        ],
        ["name", "ASC"],
      ],
    });

    res.status(200).json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error("Get All Cities Error:", error);

    return next(
      new ErrorHandler("Not able to fetch Cities", 500)
    );
  }
};