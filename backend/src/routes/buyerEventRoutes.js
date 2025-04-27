const express = require("express");
const { getEvents } = require("../controllers/buyerEventController");
const {
  buyereventQueryValidationRules,
  handleValidationErrors,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// GET /api/events
router.get("/", buyereventQueryValidationRules(), handleValidationErrors, getEvents);

module.exports = router;