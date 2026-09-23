const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Manufacturer = sequelize.define(
  "Manufacturer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Manufacturer name is required",
        },
      },
    },
  },
  {
    tableName: "manufacturers",
    timestamps: true,
  }
);

module.exports = Manufacturer;