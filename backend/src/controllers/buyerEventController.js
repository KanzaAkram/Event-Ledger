const Event = require("../models/buyerEvent");

const getEvents = async (req, res, next) => {
  try {
    const { category, format, search } = req.query;
    const query = {};
    if (category && category !== "All") query.category = category;
    if (format && format !== "All") query.format = format;
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    const events = await Event.find(query);
    console.log("Fetched events:", events); // Add this line
    res.status(200).json({
      message: "Events fetched successfully",
      events,
    });
  } catch (error) {
    next(error);
  }
};

// const getEvents = async (req, res, next) => {
//   try {
//     const { category, format, search } = req.query;

//     // Build query object
//     const query = {};

//     // Filter by category if provided and not "All"
//     if (category && category !== "All") {
//       query.category = category;
//     }

//     // Filter by format if provided and not "All"
//     if (format && format !== "All") {
//       query.format = format;
//     }

//     // Search by name if provided
//     if (search) {
//       query.name = { $regex: search, $options: "i" }; // Case-insensitive search
//     }

//     // Fetch events
//     const events = await Event.find(query).select(
//       "name category format location date price image"
//     );

//     res.status(200).json({
//       message: "Events fetched successfully",
//       events,
//     });
//   } catch (error) {
//     console.error("Get Events Error:", error);
//     next(error);
//   }
// };

module.exports = {
   getEvents,
 };