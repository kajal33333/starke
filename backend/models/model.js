const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Model = sequelize.define(
  "Model",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Model name is required",
        },
      },
    },

    manufacturerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "manufacturers",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "models",
    timestamps: true,
  }
);

module.exports = Model;