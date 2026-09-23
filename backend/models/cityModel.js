const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/db");

const City = sequelize.define(
  "cities",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "enquiry_states",
        key: "id",
      },
    },
   
  },
  {
    timestamps: true,
    paranoid: true,
  },
);

module.exports = City;
