// middleware/validationMiddleware.js
const { check, body, validationResult } = require("express-validator");

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation Errors caught in Middleware:", errors.array());
    const messages = errors.array().map((err) => err.msg);
    // Sending joined message which might result in "Confirm password is required. Passwords do not match"
    return res.status(400).json({ message: messages.join(". ") });
  }
  next();
};

// Validation rules for host registration
const hostRegistrationValidationRules = () => {
  return [
    check("organizationName")
      .trim()
      .notEmpty()
      .withMessage("Organization name is required"),
    check("orgEmail")
      .trim()
      .notEmpty()
      .withMessage("Organization email is required")
      .isEmail()
      .withMessage("Must be a valid email address")
      .normalizeEmail(),
    check("mobileNumber")
      .trim()
      .notEmpty()
      .withMessage("Mobile number is required")
      .isLength({ min: 10, max: 15 })
      .withMessage("Mobile number seems invalid"),
    check("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    // --- KEEPING Confirm Password Validation ---
    check("confirmPassword")
      .notEmpty()
      .withMessage("Confirm password is required") // Checks if field exists and is not empty
      .custom((value, { req }) => {
        // Custom check for matching password
        if (value !== req.body.password) {
          // If they don't match, throw an error which express-validator catches
          throw new Error("Passwords do not match");
        }
        // If they match, return true to indicate success
        return true;
      }),
    // ------------------------------------------

    check("orgLocation")
      .trim()
      .notEmpty()
      .withMessage("Organization location is required"),
    check("walletAddress")
      .trim()
      .notEmpty()
      .withMessage("Wallet address is required")
      .matches(/^0x[a-fA-F0-9]{40}$/)
      .withMessage("Please provide a valid wallet address"),
  ];
};

// Validation rules for host login
const hostLoginValidationRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

module.exports = {
  handleValidationErrors,
  hostRegistrationValidationRules,
  hostLoginValidationRules,
};
