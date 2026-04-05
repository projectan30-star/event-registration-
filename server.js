// ============================================================
// server.js — Express Backend
//
// This is the main server file. It:
//   1. Connects to MongoDB using Mongoose
//   2. Serves static frontend files from /public
//   3. Provides a POST /register API endpoint
//   4. Handles errors and sends proper responses
// ============================================================

// ---- Import required packages ----
const express    = require('express');   // Web framework
const mongoose   = require('mongoose'); // MongoDB connection & models
const path       = require('path');     // Built-in Node.js module for file paths

// ---- Import our Registration model ----
const Registration = require('./models/Registration');

// ---- Create the Express app ----
const app = express();

// ============================================================
// CONFIGURATION
// ============================================================

// Port the server listens on (use env variable or default to 3000)
const PORT = process.env.PORT || 3000;

// MongoDB connection string
// IMPORTANT: Replace this with your own MongoDB connection string.
// For local MongoDB:     mongodb://127.0.0.1:27017/fest_registrations
// For MongoDB Atlas:     mongodb+srv://<username>:<password>@cluster.mongodb.net/fest_registrations
const MONGO_URI = process.env.MONGO_URI || 'mongodb://project000ad_db_user:ZG94wYIw3ur9OyCp@ac-v8jdntr-shard-00-00.iihgriv.mongodb.net:27017,ac-v8jdntr-shard-00-01.iihgriv.mongodb.net:27017,ac-v8jdntr-shard-00-02.iihgriv.mongodb.net:27017/?ssl=true&replicaSet=atlas-wimfvq-shard-0&authSource=admin&appName=Cluster0';


// ============================================================
// MIDDLEWARE
// ============================================================

// Parse incoming JSON request bodies
// This allows us to access req.body in POST routes
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the /public folder
// When a browser requests "/index.html", Express serves public/index.html
app.use(express.static(path.join(__dirname, 'public')));


// ============================================================
// DATABASE CONNECTION
// ============================================================

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    // Connection is successful
    console.log('✅  Connected to MongoDB:', MONGO_URI);
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err.message);
    // Exit the process if we can't connect to the database
    process.exit(1);
  }
}


// ============================================================
// API ROUTES
// ============================================================

// ---- POST /register ----
// Receives registration data, validates it, and saves to MongoDB.

app.post('/register', async (req, res) => {
  try {
    // req.body contains the JSON data sent from the frontend
    const {
      name,
      email,
      mobile,
      registerNumber,
      department,
      eventName,
      timeSlot,
    } = req.body;

    // ---- Basic required-field validation ----
    // (The frontend validates too, but always validate on the server as well!)
    const requiredFields = { name, email, mobile, registerNumber, department, eventName, timeSlot };
    const missingFields  = Object.keys(requiredFields).filter(key => !requiredFields[key]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // ---- Create a new Registration document ----
    // This uses the Mongoose model we defined in models/Registration.js
    const newRegistration = new Registration({
      name:           name.trim(),
      email:          email.trim().toLowerCase(),
      mobile:         mobile.trim(),
      registerNumber: registerNumber.trim(),
      department:     department.trim(),
      eventName,
      timeSlot,
    });

    // ---- Save to MongoDB ----
    // await pauses execution until the save is complete
    await newRegistration.save();

    // ---- Send success response ----
    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
    });

  } catch (err) {
    // ---- Handle Duplicate Key Error (code 11000) ----
    // This happens when the same email tries to register for the
    // same event + time slot (our unique index prevents duplicates)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already registered for this event and time slot with this email address.',
      });
    }

    // ---- Handle Mongoose Validation Errors ----
    // These are thrown when data doesn't match schema rules
    if (err.name === 'ValidationError') {
      // Collect all validation error messages
      const messages = Object.values(err.errors).map(e => e.message).join(' ');
      return res.status(400).json({
        success: false,
        message: messages,
      });
    }

    // ---- Handle unexpected server errors ----
    console.error('Server error during registration:', err);
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred. Please try again later.',
    });
  }
});


// ---- Fallback route: serve index.html for any unmatched routes ----
// This ensures navigation works even if the user refreshes on event.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// ============================================================
// START SERVER
// ============================================================

// First connect to MongoDB, then start listening for requests
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀  Server running at http://localhost:${PORT}`);
  });
});
