// ============================================================
// script.js — Registration Page Logic
//
// This script handles everything on register.html:
//   1. Reads event name & time slot from the URL
//   2. Fills hidden fields and sidebar info
//   3. Validates form inputs before submission
//   4. Sends data to the backend via fetch (POST /register)
//   5. Shows success or error messages
// ============================================================


// ---- Step 1: Read URL query parameters ----
// e.g. register.html?event=Lucida&slot=12%20PM
const urlParams = new URLSearchParams(window.location.search);
const eventName = urlParams.get('event');
const timeSlot  = urlParams.get('slot');

// If the required params are missing, redirect back to homepage
if (!eventName || !timeSlot) {
  window.location.href = 'index.html';
}


// ---- Step 2: Fill in the page with event & slot info ----

// Sidebar (left column on desktop)
document.getElementById('sidebar-event').textContent = eventName;
document.getElementById('sidebar-slot').textContent  = '⏰ ' + timeSlot + ' Show';

// Hidden form fields (these get submitted to the backend)
document.getElementById('eventName').value = eventName;
document.getElementById('timeSlot').value  = timeSlot;

// Update page title and back-link
document.title = 'Register for ' + eventName + ' — Fest 2025';
document.getElementById('back-link').href = 'event.html?event=' + encodeURIComponent(eventName);


// ============================================================
// VALIDATION HELPERS
// ============================================================

// Shows an error message under a field
function showError(fieldId, message) {
  const group = document.getElementById('group-' + fieldId);
  const error = document.getElementById('error-' + fieldId);
  if (group) group.classList.add('has-error');
  if (error && message) error.textContent = message;
}

// Clears the error styling for a field
function clearError(fieldId) {
  const group = document.getElementById('group-' + fieldId);
  if (group) group.classList.remove('has-error');
}

// Validates email format using a simple regex
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validates that mobile is exactly 10 digits
function isValidMobile(mobile) {
  return /^\d{10}$/.test(mobile);
}

// Main validation function — returns true if all fields are valid
function validateForm(data) {
  let isValid = true;

  // Clear all previous errors first
  ['name', 'email', 'mobile', 'registerNumber', 'department'].forEach(clearError);

  if (!data.name.trim()) {
    showError('name', 'Please enter your full name.');
    isValid = false;
  }

  if (!data.email.trim()) {
    showError('email', 'Please enter your email address.');
    isValid = false;
  } else if (!isValidEmail(data.email)) {
    showError('email', 'Please enter a valid email address (e.g. you@example.com).');
    isValid = false;
  }

  if (!data.mobile.trim()) {
    showError('mobile', 'Please enter your mobile number.');
    isValid = false;
  } else if (!isValidMobile(data.mobile)) {
    showError('mobile', 'Mobile number must be exactly 10 digits.');
    isValid = false;
  }

  if (!data.registerNumber.trim()) {
    showError('registerNumber', 'Please enter your register number.');
    isValid = false;
  }

  if (!data.department) {
    showError('department', 'Please select your department.');
    isValid = false;
  }

  return isValid;
}


// ============================================================
// FORM SUBMISSION
// ============================================================

const form       = document.getElementById('registration-form');
const submitBtn  = document.getElementById('submit-btn');
const statusMsg  = document.getElementById('form-status');

form.addEventListener('submit', async function(event) {
  // Prevent the default browser form submission (page reload)
  event.preventDefault();

  // ---- Collect form field values ----
  const formData = {
    name:           document.getElementById('name').value.trim(),
    email:          document.getElementById('email').value.trim(),
    mobile:         document.getElementById('mobile').value.trim(),
    registerNumber: document.getElementById('registerNumber').value.trim(),
    department:     document.getElementById('department').value,
    eventName:      document.getElementById('eventName').value,
    timeSlot:       document.getElementById('timeSlot').value,
  };

  // ---- Run frontend validation ----
  const isValid = validateForm(formData);
  if (!isValid) {
    statusMsg.textContent = 'Please fix the errors above before submitting.';
    statusMsg.className   = 'error';
    return; // Stop here — don't send to server
  }

  // ---- Disable button to prevent double-submission ----
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Submitting…';
  statusMsg.textContent = '';
  statusMsg.className   = '';

  try {
    // ---- Send POST request to backend ----
    // fetch() is a built-in browser API for making HTTP requests
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'  // Tell server we're sending JSON
      },
      body: JSON.stringify(formData)  // Convert JS object → JSON string
    });

    // Parse the JSON response from the server
    const result = await response.json();

    if (response.ok) {
      // ---- SUCCESS: Show the success overlay ----
      document.getElementById('success-message').textContent =
        `You've registered for ${formData.eventName} (${formData.timeSlot} Show). See you there!`;

      document.getElementById('success-overlay').classList.add('visible');

    } else {
      // ---- SERVER ERROR (e.g. duplicate registration, validation fail) ----
      statusMsg.textContent = result.message || 'Registration failed. Please try again.';
      statusMsg.className   = 'error';

      // Re-enable the button so user can fix and retry
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Complete Registration';
    }

  } catch (err) {
    // ---- NETWORK ERROR (server is down, no internet, etc.) ----
    console.error('Fetch error:', err);
    statusMsg.textContent = 'Could not reach the server. Please check your connection and try again.';
    statusMsg.className   = 'error';

    submitBtn.disabled    = false;
    submitBtn.textContent = 'Complete Registration';
  }
});
