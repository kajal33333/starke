



// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../config/db");

// const Product = sequelize.define(
//   "Product",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     name: {
//       type: DataTypes.STRING(200),
//       allowNull: false,
//     },
//     manufacturerId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: "manufacturers",
//         key: "id",
//       },
//       onUpdate: "CASCADE",
//       onDelete: "CASCADE",
//     },
//     modelId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: "models",
//         key: "id",
//       },
//       onUpdate: "CASCADE",
//       onDelete: "CASCADE",
//     },
//     category: {
//       type: DataTypes.STRING(150),
//       allowNull: false,
//     },
//     sku: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//       unique: true,
//     },
//     status: {
//       type: DataTypes.ENUM("InStock", "OutStock"),
//       allowNull: false,
//       defaultValue: "InStock",
//     },
//   },
//   {
//     tableName: "products",
//     timestamps: true,
//   }
// );

// // ==========================================
// // ASSOCIATIONS (Yeh add karna zaroori hai)
// // ==========================================

// Product.belongsTo(require("./manufacturers"), {
//   foreignKey: "manufacturerId",
//   as: "manufacturer",
// });

// Product.belongsTo(require("./model"), {
//   foreignKey: "modelId",
//   as: "model",
// });

// module.exports = Product;



const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
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

    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "models",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    category: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    status: {
      type: DataTypes.ENUM(
        "InStock",
        "OutStock"
      ),
      allowNull: false,
      defaultValue: "InStock",
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

// ==========================================
// ASSOCIATIONS
// ==========================================

Product.belongsTo(
  require("./manufacturers"),
  {
    foreignKey: "manufacturerId",
    as: "manufacturer",
  }
);

Product.belongsTo(
  require("./model"),
  {
    foreignKey: "modelId",
    as: "model",
  }
);

module.exports = Product;

