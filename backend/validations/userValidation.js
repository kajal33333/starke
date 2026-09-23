const { body } = require("express-validator");

const userValidationRules = {
    registerUserValidator: [
    body("emp_code")
      .notEmpty().withMessage("Employee Code is required"),

    body("first_name")
      .notEmpty().withMessage("First name is required")
      .isAlpha().withMessage("First name must contain only letters"),

    body("last_name")
      .notEmpty().withMessage("Last name is required")
      .isAlpha().withMessage("Last name must contain only letters"),

    body("primary_email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format"),

    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

    body("contact")
      .notEmpty().withMessage("Contact is required")
      .matches(/^\d{10}$/).withMessage("Contact must be a 10-digit number"),

    body("role_id")
      .notEmpty().withMessage("Role is required")
      .isInt().withMessage("Role ID must be an integer"),

    body("company_name")
      .optional()
      .isString().withMessage("Company name must be a string"),

    body("status_date")
      .optional()
      .isISO8601().withMessage("Status date must be a valid date"),

    body("start_date")
      .optional()
      .isISO8601().withMessage("Start date must be a valid date"),

    body("location")
      .optional()
      .isString().withMessage("Location must be a string"),

    body("address")
      .optional()
      .isString().withMessage("Address must be a string"),
  ],

  loginValidator: [
    body("emp_code")
      .notEmpty().withMessage("Employee Code is required"),

    body("password")
      .notEmpty().withMessage("Password is required"),
  ],

  resetPasswordValidator: [
    body("primary_email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format"),

    body("otp")
      .notEmpty().withMessage("OTP is required")
      .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),

    body("newPassword")
      .notEmpty().withMessage("New password is required")
      .isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
};

module.exports = userValidationRules;
