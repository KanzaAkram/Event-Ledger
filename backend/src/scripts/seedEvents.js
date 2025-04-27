const mongoose = require("mongoose");
const Event = require("../models/buyerEvent");
require("dotenv").config();

const seedEvents = async () => {
  try {
    // Connect to MongoDB (using Atlas URI from .env)
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing events
    await Event.deleteMany({});
    console.log("Cleared existing events");

    // Seed new events
    await Event.insertMany([
      {
        name: "Techno Festival 2025",
        category: "Music & Concerts",
        format: "Onsite",
        location: "Berlin, Germany",
        date: "2025-06-15",
        price: "$49",
        image: "/img/techno-festival.jpg",
      },
      {
        name: "Blockchain Summit",
        category: "Conferences & Workshops",
        format: "Virtual",
        location: "Online",
        date: "2025-07-22",
        price: "$129",
        image: "/img/blockchain-summit.jpg",
      },
      {
        name: "Anime & Cosplay Expo",
        category: "Hobbies & Special Interests",
        format: "Hybrid",
        location: "Tokyo, Japan",
        date: "2025-08-10",
        price: "$39",
        image: "/img/cosplay-expo.jpg",
      },
      {
        name: "Jazz Nights",
        category: "Music & Concerts",
        format: "Onsite",
        location: "New Orleans, USA",
        date: "2025-05-05",
        price: "$59",
        image: "/img/jazz-nights.jpg",
      },
      {
        name: "Food Truck Festival",
        category: "Food & Drink",
        format: "Onsite",
        location: "Lahore, Pakistan",
        date: "2025-09-18",
        price: "$25",
        image: "/img/food-festival.jpg",
      },
      {
        name: "Stand-Up Comedy Night",
        category: "Theater & Performing Arts",
        format: "Virtual",
        location: "Online",
        date: "2025-10-12",
        price: "$15",
        image: "/img/comedy-night.jpg",
      },
    ]);
    console.log("Events seeded successfully");

    // Close the connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedEvents();