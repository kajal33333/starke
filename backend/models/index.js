const {sequelize} = require("../config/db");

const User = require("./user");
const Role = require("./Role");

const Manufacturer = require("./manufacturers");
const Model = require("./model");
const Product = require("./product");

const City = require("./cityModel");
const Enquiry_State = require("./enquiryStateModel");

// Manufacturer ↔ Model
Manufacturer.hasMany(Model, {
  foreignKey: "manufacturerId",
  as: "models",
});

Model.belongsTo(Manufacturer, {
  foreignKey: "manufacturerId",
  as: "manufacturer",
});

// City ↔ State
City.belongsTo(Enquiry_State, {
  foreignKey: "state_id",
  as: "stateInfo",
});

module.exports = {
  sequelize,
  User,
  Role,
  Manufacturer,
  Model,
  Product,
  City,
  Enquiry_State,
};