

//   const Manufacturer = require("../models/manufacturers");
//   const Product = require("../models/product");
// const Model = require("../models/model")
//   // ==========================================
//   // GET PRODUCTS
//   //
//   // GET /api/v1/products
//   // GET /api/v1/products?id=1
//   // ==========================================
  
//   exports.getProducts = async (req, res) => {
//     try {
//       const { id } = req.query;
  
//       // ================================
//       // GET SINGLE PRODUCT
//       // ================================
  
//       if (id) {
//         const product = await Product.findOne({
//           where: {
//             id: Number(id),
//           },
  
//           include: [
//             {
//               model: Manufacturer,
//               as: "manufacturer",
//               attributes: ["id", "name"],
//             },
//             {
//               model: Model,
//               as: "model",
//               attributes: ["id", "name"],
//             },
//           ],
//         });
  
//         if (!product) {
//           return res.status(404).json({
//             success: false,
//             message: "Product not found",
//           });
//         }
  
//         return res.status(200).json({
//           success: true,
//           data: product,
//         });
//       }
  
//       // ================================
//       // GET ALL PRODUCTS
//       // ================================
  
//       const products = await Product.findAll({
//         include: [
//           {
//             model: Manufacturer,
//             as: "manufacturer",
//             attributes: ["id", "name"],
//           },
//           {
//             model: Model,
//             as: "model",
//             attributes: ["id", "name"],
//           },
//         ],
  
//         order: [["id", "DESC"]],
//       });
  
//       return res.status(200).json({
//         success: true,
//         data: products,
//       });
//     } catch (error) {
//       console.error("Get products error:", error);
  
//       return res.status(500).json({
//         success: false,
//         message: "Failed to load products",
//         error: error.message,
//       });
//     }
//   };
  
//   // ==========================================
//   // CREATE PRODUCT
//   // POST /api/v1/products
//   // ==========================================
  
 
//   exports.createProduct = async (req, res) => {
//     try {
//       console.log("=================================");
//       console.log("CREATE PRODUCT API HIT");
//       console.log("BODY:", req.body);
//       console.log("=================================");
  
//       const {
//         name,
//         manufacturerId,
//         modelId,
//         category,
//         sku,
//         status,
//       } = req.body;
  
//       // ==========================================
//       // REQUIRED FIELDS
//       // ==========================================
  
//       if (
//         !name ||
//         !manufacturerId ||
//         !modelId ||
//         !category ||
//         !sku
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Name, manufacturer, model, category and SKU are required",
//         });
//       }
  
//       // ==========================================
//       // CHECK MANUFACTURER
//       // ==========================================
  
//       const manufacturer = await Manufacturer.findByPk(
//         Number(manufacturerId)
//       );
  
//       if (!manufacturer) {
//         return res.status(404).json({
//           success: false,
//           message: "Manufacturer not found",
//         });
//       }
  
//       // ==========================================
//       // CHECK MODEL
//       // ==========================================
  
//       const model = await Model.findOne({
//         where: {
//           id: Number(modelId),
//           manufacturerId: Number(manufacturerId),
//         },
//       });
  
//       if (!model) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Model does not belong to selected manufacturer",
//         });
//       }
  
//       // ==========================================
//       // CHECK DUPLICATE SKU
//       // ==========================================
  
//       const existingSku = await Product.findOne({
//         where: {
//           sku: sku.trim(),
//         },
//       });
  
//       if (existingSku) {
//         return res.status(409).json({
//           success: false,
//           message: "SKU already exists",
//         });
//       }
  
//       // ==========================================
//       // CREATE PRODUCT
//       // ==========================================
  
//       const product = await Product.create({
//         name: name.trim(),
  
//         manufacturerId: Number(manufacturerId),
  
//         modelId: Number(modelId),
  
//         category: category.trim(),
  
//         sku: sku.trim(),
  
//         status: status === "OutStock" ? "OutStock" : "InStock",
//       });
  
//       return res.status(201).json({
//         success: true,
//         message: "Product created successfully",
//         data: product,
//       });
  
//     } catch (error) {
//       console.error("CREATE PRODUCT ERROR:", error);
  
//       return res.status(500).json({
//         success: false,
//         message: "Failed to create product",
//         error: error.message,
//       });
//     }
//   };


  
//   // ==========================================
//   // UPDATE PRODUCT
//   // PUT /api/v1/products
//   // ==========================================
  
  
// exports.updateProduct = async (req, res) => {
//   try {
//     const {
//       id,
//       name,
//       manufacturerId,
//       modelId,
//       category,
//       sku,
//       status,
//     } = req.body;

//     // ================================
//     // ID CHECK
//     // ================================

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Product ID is required",
//       });
//     }

//     // ================================
//     // REQUIRED FIELDS
//     // ================================

//     if (
//       !name ||
//       !manufacturerId ||
//       !modelId ||
//       !category ||
//       !sku
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Name, manufacturer, model, category and SKU are required",
//       });
//     }

//     // ================================
//     // VALIDATE STATUS
//     // ================================

//     if (status && !["InStock", "OutStock"].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid product status",
//       });
//     }

//     // ================================
//     // FIND PRODUCT
//     // ================================

//     const product = await Product.findByPk(Number(id));

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     // ================================
//     // CHECK MANUFACTURER
//     // ================================

//     const manufacturer = await Manufacturer.findByPk(
//       Number(manufacturerId)
//     );

//     if (!manufacturer) {
//       return res.status(404).json({
//         success: false,
//         message: "Manufacturer not found",
//       });
//     }

//     // ================================
//     // CHECK MODEL
//     // ================================

//     const model = await Model.findOne({
//       where: {
//         id: Number(modelId),
//         manufacturerId: Number(manufacturerId),
//       },
//     });

//     if (!model) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Model does not belong to selected manufacturer",
//       });
//     }

//     // ================================
//     // CHECK DUPLICATE SKU
//     // ================================

//     const existingSku = await Product.findOne({
//       where: {
//         sku: sku.trim(),
//       },
//     });

//     if (
//       existingSku &&
//       existingSku.id !== Number(id)
//     ) {
//       return res.status(409).json({
//         success: false,
//         message: "SKU already exists",
//       });
//     }

//     // ================================
//     // UPDATE PRODUCT
//     // ================================

//     await product.update({
//       name: name.trim(),
//       manufacturerId: Number(manufacturerId),
//       modelId: Number(modelId),
//       category: category.trim(),
//       sku: sku.trim(),
//       status: status || product.status || "InStock",
//     });

//     // ================================
//     // RESPONSE
//     // ================================

//     return res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       data: product,
//     });

//   } catch (error) {
//     console.error("Update product error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update product",
//       error: error.message,
//     });
//   }
// };




const { Op } = require("sequelize");

const Manufacturer = require("../models/manufacturers");
const Product = require("../models/product");
const Model = require("../models/model");

// ==========================================
// GET PRODUCTS
// GET /api/v1/products
// ==========================================

exports.getProducts = async (req, res) => {
  try {
    const {
      id,
      page = 1,
      limit = 10,
      search = "",
      manufacturerId,
      status,
    } = req.query;

    // ==========================================
    // GET SINGLE PRODUCT
    // ==========================================

    if (id) {
      const product = await Product.findOne({
        where: {
          id: Number(id),
        },

        include: [
          {
            model: Manufacturer,
            as: "manufacturer",
            attributes: ["id", "name"],
          },
          {
            model: Model,
            as: "model",
            attributes: ["id", "name"],
          },
        ],
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: product,
      });
    }

    // ==========================================
    // PAGINATION
    // ==========================================

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const pageLimit = Math.max(
      Number(limit) || 10,
      1
    );

    const offset =
      (currentPage - 1) * pageLimit;

    // ==========================================
    // WHERE
    // ==========================================

    const where = {};

    // ==========================================
    // SEARCH
    // Product Name
    // Category / Part No
    // SKU
    // ==========================================

    if (search.trim()) {
      where[Op.or] = [
        {
          name: {
            [Op.like]: `%${search.trim()}%`,
          },
        },
        {
          category: {
            [Op.like]: `%${search.trim()}%`,
          },
        },
        {
          sku: {
            [Op.like]: `%${search.trim()}%`,
          },
        },
      ];
    }

    // ==========================================
    // MANUFACTURER FILTER
    // ==========================================

    if (manufacturerId) {
      where.manufacturerId =
        Number(manufacturerId);
    }

    // ==========================================
    // STATUS FILTER
    // ==========================================

    if (
      status &&
      ["InStock", "OutStock"].includes(status)
    ) {
      where.status = status;
    }

    // ==========================================
    // GET PRODUCTS
    // ==========================================

    const {
      count,
      rows: products,
    } = await Product.findAndCountAll({
      where,

      include: [
        {
          model: Manufacturer,
          as: "manufacturer",
          attributes: ["id", "name"],
        },
        {
          model: Model,
          as: "model",
          attributes: ["id", "name"],
        },
      ],

      order: [["id", "DESC"]],

      limit: pageLimit,

      offset,
    });

    // ==========================================
    // TOTAL PAGES
    // ==========================================

    const totalPages = Math.ceil(
      count / pageLimit
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      data: products,

      pagination: {
        currentPage,
        limit: pageLimit,
        totalItems: count,
        totalPages,
      },
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load products",
      error: error.message,
    });
  }
};

// ==========================================
// CREATE PRODUCT
// POST /api/v1/products
// ==========================================

exports.createProduct = async (req, res) => {
  try {
    console.log("=================================");
    console.log("CREATE PRODUCT API HIT");
    console.log("BODY:", req.body);
    console.log("=================================");

    const {
      name,
      manufacturerId,
      modelId,
      category,
      sku,
      status,
    } = req.body;

    // ==========================================
    // REQUIRED FIELDS
    // ==========================================

    if (
      !name ||
      !manufacturerId ||
      !modelId ||
      !category ||
      !sku
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, manufacturer, model, category and SKU are required",
      });
    }

    // ==========================================
    // CHECK MANUFACTURER
    // ==========================================

    const manufacturer =
      await Manufacturer.findByPk(
        Number(manufacturerId)
      );

    if (!manufacturer) {
      return res.status(404).json({
        success: false,
        message: "Manufacturer not found",
      });
    }

    // ==========================================
    // CHECK MODEL
    // ==========================================

    const model = await Model.findOne({
      where: {
        id: Number(modelId),
        manufacturerId: Number(
          manufacturerId
        ),
      },
    });

    if (!model) {
      return res.status(400).json({
        success: false,
        message:
          "Model does not belong to selected manufacturer",
      });
    }

    // ==========================================
    // CHECK DUPLICATE SKU
    // ==========================================

    const existingSku =
      await Product.findOne({
        where: {
          sku: sku.trim(),
        },
      });

    if (existingSku) {
      return res.status(409).json({
        success: false,
        message: "SKU already exists",
      });
    }

    // ==========================================
    // CREATE
    // ==========================================

    const product =
      await Product.create({
        name: name.trim(),

        manufacturerId:
          Number(manufacturerId),

        modelId: Number(modelId),

        category: category.trim(),

        sku: sku.trim(),

        status:
          status === "OutStock"
            ? "OutStock"
            : "InStock",
      });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error(
      "CREATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PRODUCT
// PUT /api/v1/products
// ==========================================

exports.updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      manufacturerId,
      modelId,
      category,
      sku,
      status,
    } = req.body;

    // ==========================================
    // ID CHECK
    // ==========================================

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // ==========================================
    // REQUIRED FIELDS
    // ==========================================

    if (
      !name ||
      !manufacturerId ||
      !modelId ||
      !category ||
      !sku
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, manufacturer, model, category and SKU are required",
      });
    }

    // ==========================================
    // VALIDATE STATUS
    // ==========================================

    if (
      status &&
      !["InStock", "OutStock"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product status",
      });
    }

    // ==========================================
    // FIND PRODUCT
    // ==========================================

    const product =
      await Product.findByPk(Number(id));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ==========================================
    // CHECK MANUFACTURER
    // ==========================================

    const manufacturer =
      await Manufacturer.findByPk(
        Number(manufacturerId)
      );

    if (!manufacturer) {
      return res.status(404).json({
        success: false,
        message: "Manufacturer not found",
      });
    }

    // ==========================================
    // CHECK MODEL
    // ==========================================

    const model = await Model.findOne({
      where: {
        id: Number(modelId),
        manufacturerId: Number(
          manufacturerId
        ),
      },
    });

    if (!model) {
      return res.status(400).json({
        success: false,
        message:
          "Model does not belong to selected manufacturer",
      });
    }

    // ==========================================
    // CHECK DUPLICATE SKU
    // ==========================================

    const existingSku =
      await Product.findOne({
        where: {
          sku: sku.trim(),
        },
      });

    if (
      existingSku &&
      existingSku.id !== Number(id)
    ) {
      return res.status(409).json({
        success: false,
        message: "SKU already exists",
      });
    }

    // ==========================================
    // UPDATE
    // ==========================================

    await product.update({
      name: name.trim(),

      manufacturerId:
        Number(manufacturerId),

      modelId: Number(modelId),

      category: category.trim(),

      sku: sku.trim(),

      status:
        status ||
        product.status ||
        "InStock",
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

