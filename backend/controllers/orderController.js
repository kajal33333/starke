
const Order = require("../models/order");
const User = require("../models/user");
const Role = require("../models/Role");

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity, userId, status } = req.body;

    if (!productId || !quantity || !userId) {
      return res.status(400).json({
        success: false,
        message: "Product, quantity and user are required",
      });
    }

    const orderNo = `ORD-${Date.now()}`;

    const newOrder = await Order.create({
      orderNo,
      productId: Number(productId),
      quantity: Number(quantity),
      userId: String(userId),
      status: status || "In Process",
    });

    const user = await User.findByPk(Number(userId), {
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "role_name"],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully!",
      data: {
        ...newOrder.toJSON(),

        user: user
          ? {
              id: user.id,
              role: user.role || null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Get All / Single Orders
exports.getOrders = async (req, res) => {
  try {
    const { id } = req.query;

    if (id) {
      const order = await Order.findByPk(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const user = await User.findByPk(Number(order.userId), {
        include: [
          {
            model: Role,
            as: "role",
            attributes: ["id", "role_name"],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        data: {
          ...order.toJSON(),
          role: user?.role || null,
        },
      });
    }

    const orders = await Order.findAll({
      order: [["createdAt", "DESC"]],
    });

    const ordersWithRole = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findByPk(Number(order.userId), {
          include: [
            {
              model: Role,
              as: "role",
              attributes: ["id", "role_name"],
            },
          ],
        });

        return {
          ...order.toJSON(),
          role: user?.role || null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: ordersWithRole,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Update Order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      productId,
      quantity,
      userId,
      status,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required for update",
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.update({
      productId:
        productId !== undefined
          ? Number(productId)
          : order.productId,

      quantity:
        quantity !== undefined
          ? Number(quantity)
          : order.quantity,

      userId:
        userId !== undefined
          ? String(userId)
          : order.userId,

      status:
        status !== undefined
          ? status
          : order.status,
    });

    const user = await User.findByPk(Number(order.userId));

    return res.status(200).json({
      success: true,
      message: "Order updated successfully!",
      data: {
        ...order.toJSON(),
        user: user
          ? {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Update Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.destroy();

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully!",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};