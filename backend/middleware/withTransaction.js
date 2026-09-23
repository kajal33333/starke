// middlewares/withTransaction.js
const sequelize = require('../config/database');

const withTransaction = (handler) => async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    // Pass the transaction as an additional argument to your controller.
    await handler(req, res, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
  
};

module.exports = withTransaction;


// // controllers/user.controller.js
// const User = require('../models/user.model');
// const asyncHandler = require('../middlewares/asyncHandler');

// // Instead of exporting the function directly, we now accept a transaction.
// exports.uploadAvatar = asyncHandler(async (req, res, transaction) => {
//   if (!req.file) {
//     res.status(400);
//     throw new Error('No file uploaded');
//   }

//   // Use the passed-in transaction for any database operations.
//   const user = await User.findByPk(req.user.id, { transaction });
//   if (!user) {
//     res.status(404);
//     throw new Error('User not found');
//   }

//   user.avatar = req.file.path;
//   await user.save({ transaction });

//   res.json({
//     success: true,
//     message: 'Avatar updated successfully',
//     avatar: user.avatar,
//   });
// });


// // routes/user.router.js
// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/user.controller');
// const authMiddleware = require('../middlewares/authMiddleware');
// const uploadMiddleware = require('../middlewares/uploadMiddleware');
// const withTransaction = require('../middlewares/withTransaction');

// // Login route (no transaction needed).
// router.post('/login', userController.login);

// // Upload avatar route with transaction support.
// // The middleware chain is: authMiddleware → uploadMiddleware.single('avatar') → withTransaction(userController.uploadAvatar)
// router.post(
//   '/upload-avatar',
//   authMiddleware,
//   uploadMiddleware.single('avatar'),
//   withTransaction(userController.uploadAvatar)
// );

// module.exports = router;


