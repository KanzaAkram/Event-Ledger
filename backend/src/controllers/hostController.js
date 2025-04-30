// controllers/hostController.js

const Host = require("../models/Host");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// --- Helper Function to Generate JWT ---
const generateToken = (id) => {
  // Ensure JWT_SECRET is loaded
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    // In a real app, you might want to throw an error or exit
    // For now, we'll proceed but log the critical error
  }
  return jwt.sign({ id }, secret || "fallback_secret", {
    // Use fallback only as last resort
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// @desc    Register a new Event Host
// @route   POST /api/hosts/register
// @access  Public
const registerHost = async (req, res, next) => {
  console.log("Register request body:", req.body); // Log received body for debugging

  // Destructure fields needed for creation and basic validation
  // REMOVED confirmPassword from destructuring
  const {
    organizationName,
    orgEmail,
    mobileNumber,
    password,
    // confirmPassword, // No longer needed here
    orgLocation,
    walletAddress,
  } = req.body;

  // --- Basic Backend Validations ---
  // REMOVED check for !confirmPassword
  if (
    !organizationName ||
    !orgEmail ||
    !mobileNumber ||
    !password ||
    // !confirmPassword || // Removed check
    !orgLocation ||
    !walletAddress
  ) {
    // Added more specific messages potentially
    if (!organizationName)
      return res
        .status(400)
        .json({ message: "Organization name is required." });
    if (!orgEmail)
      return res
        .status(400)
        .json({ message: "Organization email is required." });
    if (!mobileNumber)
      return res.status(400).json({ message: "Mobile number is required." });
    if (!password)
      return res.status(400).json({ message: "Password is required." });
    if (!orgLocation)
      return res
        .status(400)
        .json({ message: "Organization location is required." });
    if (!walletAddress)
      return res.status(400).json({ message: "Wallet address is required." });

    // Fallback generic message (less likely to be hit now)
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  // REMOVED password match check (Frontend handles this)
  // if (password !== confirmPassword) {
  //   return res.status(400).json({ message: "Passwords do not match." });
  // }

  // Keep password length check
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }

  // Keep email format check
  if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(orgEmail)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // Keep wallet address format check
  if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    return res.status(400).json({ message: "Invalid wallet address format." });
  }
  // --- End Validations ---

  try {
    // Check if email OR wallet address already exists (Unchanged)
    const hostExists = await Host.findOne({
      $or: [
        { orgEmail: orgEmail.toLowerCase() },
        { walletAddress: walletAddress },
      ],
    }).lean(); // Use lean for faster read-only queries if not modifying the result

    if (hostExists) {
      let message = "Registration failed.";
      // Check which field caused the conflict
      const existingByEmail = await Host.findOne({
        orgEmail: orgEmail.toLowerCase(),
      }).lean();
      if (existingByEmail) {
        message = "An organization with this email already exists.";
      } else {
        // If not email, must be wallet address (assuming findOne worked)
        message = "This wallet address is already registered.";
      }
      // More robust check
      // if (hostExists.orgEmail === orgEmail.toLowerCase()) {
      //   message = "An organization with this email already exists.";
      // } else if (hostExists.walletAddress === walletAddress) { // Direct comparison should be fine
      //   message = "This wallet address is already registered.";
      // }
      console.warn(
        `Registration conflict for ${orgEmail} / ${walletAddress}: ${message}`
      );
      return res.status(400).json({ message });
    }

    // Create new host instance (Unchanged - uses only 'password')
    const newHost = new Host({
      organizationName,
      orgEmail: orgEmail.toLowerCase(),
      mobileNumber,
      password, // Hashing happens in pre-save hook
      orgLocation,
      walletAddress,
    });

    const savedHost = await newHost.save();
    console.log("Host saved successfully:", savedHost._id);

    // Respond without sending the password back (Unchanged)
    res.status(201).json({
      message: "Host registration successful. You can now log in.",
      host: {
        _id: savedHost._id,
        organizationName: savedHost.organizationName,
        orgEmail: savedHost.orgEmail,
        mobileNumber: savedHost.mobileNumber,
        orgLocation: savedHost.orgLocation,
        walletAddress: savedHost.walletAddress,
        createdAt: savedHost.createdAt, // Added from schema timestamps:true
        updatedAt: savedHost.updatedAt, // Added from schema timestamps:true
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    // Handle Mongoose validation errors (Unchanged)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      // More specific check for unique index errors (code 11000)
      if (
        error.code === 11000 ||
        error.message.includes("duplicate key error")
      ) {
        if (error.keyPattern && error.keyPattern.orgEmail) {
          return res
            .status(400)
            .json({
              message: "An organization with this email already exists.",
            });
        } else if (error.keyPattern && error.keyPattern.walletAddress) {
          return res
            .status(400)
            .json({ message: "This wallet address is already registered." });
        }
      }
      return res.status(400).json({ message: messages.join(" ") });
    }
    // Pass other errors to the central error handler (Unchanged)
    next(error);
  }
};

// --- Login Host Function --- (remains the same)
const loginHost = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password." });
  }

  try {
    // Find host by email, case-insensitive
    const host = await Host.findOne({ orgEmail: email.toLowerCase() });

    // Check if host exists and password matches
    if (host && (await host.comparePassword(password))) {
      const token = generateToken(host._id);

      res.status(200).json({
        message: "Login successful",
        token: token, // Send the token
        host: {
          // Send selected host details
          _id: host._id,
          organizationName: host.organizationName,
          orgEmail: host.orgEmail,
          walletAddress: host.walletAddress,
        },
      });
    } else {
      // Generic message for security
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    next(error); // Pass to error handling middleware
  }
};

module.exports = {
  registerHost,
  loginHost,
};
