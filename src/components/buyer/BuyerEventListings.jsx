import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Ticket, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  "All",
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
];

const formats = ["All", "Onsite", "Virtual", "Hybrid"];

const BuyerEventListings = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          ...(selectedCategory !== "All" && { category: selectedCategory }),
          ...(selectedFormat !== "All" && { format: selectedFormat }),
          ...(searchQuery && { search: searchQuery }),
        }).toString();

        const url = queryParams ? `/api/events?${queryParams}` : "/api/events";
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.statusText}`);
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedCategory, selectedFormat, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black py-16 px-6">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-500 to-indigo-400 mb-12"
      >
        Discover Exciting Events
      </motion.h1>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mb-12">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8 max-w-xl mx-auto"
        >
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-12 pr-4 rounded-full bg-black/50 border border-purple-800 text-purple-200 placeholder-purple-400 focus:outline-none focus:border-pink-500"
          />
          <Search className="absolute left-4 top-3.5 text-purple-400" size={20} />
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            <span className="text-purple-300 font-semibold mr-2 self-center">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 border tracking-wide ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
                    : "bg-black/40 text-purple-300 border-purple-800 hover:border-pink-500 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Format Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            <span className="text-purple-300 font-semibold mr-2 self-center">
              Format:
            </span>
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 border tracking-wide ${
                  selectedFormat === format
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
                    : "bg-black/40 text-purple-300 border-purple-800 hover:border-pink-500 hover:text-white"
                }`}
              >
                {format}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-purple-400 mt-12 text-xl"
        >
          Loading events...
        </motion.p>
      )}

      {/* Error State */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-pink-400 mt-12 text-xl"
        >
          Error: {error}
        </motion.p>
      )}

      {/* Event Listings */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
        >
          <AnimatePresence>
            {events.map((event) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative group border border-purple-800/40 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden hover:shadow-purple-800/50"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-pink-600 opacity-20 blur-xl rounded-3xl group-hover:opacity-40 transition-opacity duration-300"></div>

                {/* Event Image */}
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-48 object-cover rounded-t-3xl border-b border-purple-700/40"
                />

                {/* Event Details */}
                <div className="relative p-5 z-10 text-purple-200">
                  <h2 className="text-xl font-bold mb-2 text-pink-300 tracking-wide">
                    {event.name}
                  </h2>
                  <div className="flex items-center text-sm space-x-2 mb-1 text-purple-400">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm space-x-2 mb-1 text-purple-400">
                    <Calendar size={16} />
                    <span>
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-purple-400 mb-4">
                    Format: {event.format}
                  </div>

                  {/* Price and Buy Button */}
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-pink-400">
                      {event.price}
                    </span>
                    <button className="bg-gradient-to-br from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-semibold py-2 px-4 rounded-xl flex items-center gap-2 shadow-md hover:scale-105 transition-transform duration-200">
                      <Ticket size={18} />
                      Buy Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* No Results Message */}
      {!loading && !error && events.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-purple-400 mt-12 text-xl"
        >
          No events found. Try adjusting your filters or search.
        </motion.p>
      )}
    </div>
  );
};

export default BuyerEventListings;