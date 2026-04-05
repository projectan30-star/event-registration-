// ============================================================
// models/Registration.js
//
// This file defines the MongoDB "schema" (structure) for a
// registration document. Mongoose uses this schema to:
//   - Validate data before saving
//   - Create the "registrations" collection in MongoDB
// ============================================================

const mongoose = require('mongoose');

// ---- Define the Schema ----
// A schema describes what fields each document will have
// and any rules (required, unique, etc.) for those fields.

const registrationSchema = new mongoose.Schema(
  {
    // Participant's full name
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,          // removes extra whitespace from both ends
    },

    // Email address
    email: {
      type:     String,
      required: [true, 'Email is required'],
      trim:     true,
      lowercase: true,         // always store email in lowercase
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address'
      ],
    },

    // 10-digit mobile number (stored as string to preserve leading zeros)
    mobile: {
      type:     String,
      required: [true, 'Mobile number is required'],
      match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits'],
    },

    // College register / roll number
    registerNumber: {
      type:     String,
      required: [true, 'Register number is required'],
      trim:     true,
    },

    // Department / branch
    department: {
      type:     String,
      required: [true, 'Department is required'],
      trim:     true,
    },

    // Which event they registered for (Lucida / Nrityadarpan / Metanoia)
    eventName: {
      type:     String,
      required: [true, 'Event name is required'],
      enum:     ['Lucida', 'Nrityadarpan', 'Metanoia'], // only these values allowed
    },

    // Which time slot they chose
    timeSlot: {
      type:     String,
      required: [true, 'Time slot is required'],
      enum:     ['12 PM', '3 PM'],
    },
  },

  {
    // Automatically adds "createdAt" and "updatedAt" timestamp fields
    timestamps: true,
  }
);

// ---- BONUS: Prevent Duplicate Registrations ----
// The compound unique index below ensures that the same email
// cannot register for the same event at the same time slot twice.
// If they try, MongoDB will throw an error with code 11000.
registrationSchema.index(
  { email: 1, eventName: 1, timeSlot: 1 },
  { unique: true }
);

// ---- Export the Model ----
// mongoose.model('Registration', schema) creates a model named
// 'Registration', which maps to the 'registrations' collection in MongoDB.
module.exports = mongoose.model('Registration', registrationSchema);
