const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: [
        "Music & Concerts",
        "Sports",
        "Theater & Performing Arts",
        "Festivals & Fairs",
        "Conferences & Workshops",
        "Family & Kids",
        "Food & Drink",
        "Art & Culture",
        "Nightlife & Parties",
        "Charity & Community",
        "Hobbies & Special Interests",
      ],
    },
    format: {
      type: String,
      required: [true, "Event format is required"],
      enum: ["Onsite", "Virtual", "Hybrid"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    price: {
      type: String,
      required: [true, "Event price is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Event image is required"],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;