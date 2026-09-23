const express = require("express");

const {
  register,
  login,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);

router.post("/register", register);

router.post("/login", login);

router.put("/", updateUser);

router.delete("/", deleteUser);

module.exports = router;