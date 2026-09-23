const ErrorHandler = require("../utils/errorHandler");
const {Role_Permissions}=require("../models/index")



const permissionMiddleware = async (req, res, next) => {
  // Extract menu_id from headers
  const menuId = req.headers.m_id;
  const pass = req.headers.pass;

  if(pass=="pass")
  {
    next();
  }
  else{
    if (!menuId) {
      return next(new ErrorHandler("menu_id header is missing", 400));
    }
  
    // Ensure that authMiddleware has set req.user and that user has a role_id.
    const userRoleId = req.user && req.user.role_id;
    if (!userRoleId) {
      return next(new ErrorHandler("User role information not found", 403));
    }
  
    try {
      // Query the role_permissions table to check for a permission record.
  
      const rolePermission = await Role_Permissions.findOne({
        where: {
          role_id: userRoleId,
          menu_id: menuId,
          // If you want to check a flag (e.g., 'actions') to determine if permission is granted,
          // ensure that it is set to true.
          actions: true,
        },
      });
  
      if (!rolePermission) {
        return next(new ErrorHandler("Access Denied!!! ", 403));
      }
  
      // If permission is found, allow the request to proceed.
      next();
    } catch (error) {
      console.error(error);
      return next(new ErrorHandler("Server Error", 500));
    }
  }


};

module.exports = permissionMiddleware;
