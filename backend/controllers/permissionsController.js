
const getSidebar = async (req, res) => {
  try {
    const sidebar = [
      {
        title: "Admin",
        children: [
          {
            title: "Dashboard",
            url: "/admin/dashboard",
            menu_name: "Dashboard",
            children: [],
          },
          {
            title: "Users",
            url: "/admin/users",
            menu_name: "Users",
            children: [],
          },
          {
            title: "Roles",
            url: "/admin/roles",
            menu_name: "Roles",
            children: [],
          },
          {
            title: "Manufacturers",
            url: "/admin/manufacturers",
            menu_name: "Manufacturers",
            children: [],
          },
          {
            title: "Models",
            url: "/admin/models",
            menu_name: "Models",
            children: [],
          },
          {
            title: "Product",
            url: "/admin/product",
            menu_name: "Products",
            children: [],
          },
          {
            title: "Order",
            url: "/admin/order",
            menu_name: "Orders",
            children: [],
          },
        ],
      },
    ];

    return res.status(200).json({
      success: true,
      data: sidebar,
    });
  } catch (error) {
    console.error("Get sidebar error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sidebar",
      error: error.message,
    });
  }
};

module.exports = {
  getSidebar,
};

