const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/db");

const Enquiry_State = sequelize.define(
  "enquiry_states",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Enquiry_State;
