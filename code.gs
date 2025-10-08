// ========== CONFIGURATION ==========
const SHEET_ID = "1DyDhpc5yoIe2sTULdVaiy8A2cderoor4sngKYQ3Se6c";
const SHEET_NAME = "Feuille 1";
// ===================================

/**
 * doPost - Receives form submissions from your website
 */
function doPost(e) {
  try {
    Logger.log("========================================");
    Logger.log("📥 NEW FORM SUBMISSION RECEIVED");
    Logger.log("Timestamp: " + new Date().toISOString());
    Logger.log("========================================");

    // Parse the incoming payload
    var payload = parsePayload(e);
    Logger.log("✅ Payload parsed successfully");
    Logger.log("Payload fields: " + Object.keys(payload).join(", "));

    // Validate required fields
    var errors = validatePayload(payload);
    if (errors.length > 0) {
      Logger.log("❌ VALIDATION FAILED");
      Logger.log("Validation errors: " + errors.join(", "));
      return jsonResponse({ status: "error", errors: errors }, 400);
    }
    Logger.log("✅ Validation passed");

    // Normalize and sanitize data
    payload = normalizePayload(payload);
    Logger.log("✅ Data normalized");

    // Append to Google Sheet
    Logger.log("📊 Attempting to append to Google Sheet...");
    appendToSheet(payload);

    Logger.log("========================================");
    Logger.log("✅ SUCCESS - Data saved to Google Sheet");
    Logger.log("Submission ID: " + payload.submissionId);
    Logger.log("========================================");
    return jsonResponse(
      { status: "success", message: "Application submitted successfully!" },
      200
    );
  } catch (err) {
    Logger.log("========================================");
    Logger.log("❌ ERROR IN doPost");
    Logger.log("Error message: " + err.message);
    Logger.log("Error stack: " + (err.stack || "No stack trace"));
    Logger.log("========================================");
    return jsonResponse(
      {
        status: "error",
        message: "An error occurred. Please try again.",
        details: err.message || String(err),
      },
      500
    );
  }
}

/**
 * doGet - Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(
    "ALX Tech Club Form Handler is running! Use POST to submit data."
  );
}

/**
 * Parse incoming payload (JSON or form-urlencoded)
 */
function parsePayload(e) {
  try {
    // Log the raw event for debugging
    Logger.log("=== PARSING PAYLOAD ===");
    Logger.log("Content-Type: " + (e.postData ? e.postData.type : "undefined"));
    Logger.log("Raw event parameter: " + JSON.stringify(e.parameter));
    Logger.log(
      "Raw postData: " + (e.postData ? JSON.stringify(e.postData) : "undefined")
    );

    // Try to get raw data string first
    if (e.postData) {
      var rawData = e.postData.getDataAsString();
      Logger.log("Raw data string: " + rawData);
      Logger.log("Raw data length: " + rawData.length);

      // Try parsing as JSON (works for both text/plain and application/json)
      if (rawData && rawData.length > 0) {
        try {
          const parsed = JSON.parse(rawData);
          Logger.log("✅ Successfully parsed as JSON");
          Logger.log("Parsed payload: " + JSON.stringify(parsed));
          return parsed;
        } catch (jsonError) {
          Logger.log("⚠️ Not valid JSON: " + jsonError);

          // Try URL decoding first, then parse
          try {
            const decoded = decodeURIComponent(rawData);
            Logger.log("URL decoded data: " + decoded);
            const parsed = JSON.parse(decoded);
            Logger.log("✅ Successfully parsed after URL decode");
            return parsed;
          } catch (decodeError) {
            Logger.log("⚠️ URL decode failed: " + decodeError);
          }
        }
      }
    }

    // Try postData.contents (legacy support)
    if (e.postData && e.postData.contents) {
      Logger.log("Trying postData.contents");
      const parsed = JSON.parse(e.postData.contents);
      Logger.log("✅ Parsed from postData.contents");
      return parsed;
    }

    // Fall back to e.parameter (for test submissions and form-encoded data)
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      Logger.log("✅ Using e.parameter");
      return e.parameter;
    }

    throw new Error("No valid payload found in request");
  } catch (error) {
    Logger.log("❌ Error in parsePayload: " + error);
    Logger.log("Error stack: " + error.stack);
    throw error;
  }
}

/**
 * Validate required fields
 */
function validatePayload(p) {
  var errors = [];

  if (!p.fullName || String(p.fullName).trim().length < 2) {
    errors.push("Full name is required");
  }

  if (!p.age || isNaN(parseInt(p.age))) {
    errors.push("Valid age is required");
  }

  if (!p.email || String(p.email).indexOf("@") === -1) {
    errors.push("Valid email is required");
  }

  if (!p.phoneNumber || String(p.phoneNumber).trim().length < 8) {
    errors.push("Valid phone number is required");
  }

  if (!p.currentCohort) {
    errors.push("Current cohort is required");
  }

  if (!p.currentProgram) {
    errors.push("Current program is required");
  }

  if (!p.hubLocation) {
    errors.push("Hub location is required");
  }

  if (!p.volunteerRole) {
    errors.push("Volunteer role is required");
  }

  if (!p.timeCommitment) {
    errors.push("Time commitment is required");
  }

  if (!p.motivation || String(p.motivation).trim().length < 10) {
    errors.push("Motivation is required (minimum 10 characters)");
  }

  return errors;
}

/**
 * Normalize and sanitize payload
 */
function normalizePayload(p) {
  return {
    fullName: String(p.fullName || "").trim(),
    age: String(p.age || "").trim(),
    email: String(p.email || "")
      .trim()
      .toLowerCase(),
    phoneNumber: String(p.phoneNumber || "").trim(),
    currentCohort: String(p.currentCohort || "").trim(),
    currentProgram: String(p.currentProgram || "").trim(),
    hubLocation: String(p.hubLocation || "").trim(),
    volunteerRole: String(p.volunteerRole || "").trim(),
    timeCommitment: String(p.timeCommitment || "").trim(),
    motivation: String(p.motivation || "").trim(),
    experience: String(p.experience || "").trim(),
    resourceLink: String(p.resourceLink || "").trim(),
    submissionId: generateSubmissionId(),
  };
}

/**
 * Generate unique submission ID
 */
function generateSubmissionId() {
  var timestamp = new Date().getTime();
  var random = Math.floor(Math.random() * 9000 + 1000);
  return "ALX-" + timestamp + "-" + random;
}

/**
 * Append data to Google Sheet
 */
function appendToSheet(payload) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error("Sheet not found: " + SHEET_NAME);
    }

    // Prepare row data matching your column order
    var row = [
      new Date(), // A: Timestamp
      payload.submissionId, // B: Submission ID
      payload.fullName, // C: Full Name
      payload.age, // D: Age
      payload.email, // E: Email
      payload.phoneNumber, // F: Phone Number
      payload.currentCohort, // G: Current Cohort
      payload.currentProgram, // H: Current Program
      payload.hubLocation, // I: Hub Location
      payload.volunteerRole, // J: Volunteer Role
      payload.timeCommitment, // K: Time Commitment
      payload.motivation, // L: Motivation
      payload.experience, // M: Previous Experience
      payload.resourceLink, // N: Resource Link
    ];

    // Append the row
    sheet.appendRow(row);

    Logger.log("Row appended successfully");
    Logger.log("Data: " + JSON.stringify(row));
  } catch (err) {
    Logger.log("Error appending to sheet: " + (err.stack || err));
    throw new Error("Failed to save data: " + err.message);
  }
}

/**
 * Return JSON response
 */
function jsonResponse(obj, statusCode) {
  statusCode = statusCode || 200;
  var output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Test function - CORRECTED VERSION - Run this to test
 */
function testSubmission() {
  Logger.log("=== Starting test submission ===");

  // Create test payload
  var testPayload = {
    fullName: "Test User",
    age: "25",
    email: "test@example.com",
    phoneNumber: "+212612345678",
    currentCohort: "Cohort 12",
    currentProgram: "Software Engineering",
    hubLocation: "Hub Rabat",
    volunteerRole: "Graphic Designer",
    timeCommitment: "4-6 hours/week",
    motivation:
      "I am passionate about technology and want to contribute to the ALX community.",
    experience: "I have volunteered at previous tech events.",
    resourceLink: "https://linkedin.com/in/testuser",
  };

  // Simulate the event object that comes from a real POST request
  var simulatedEvent = {
    parameter: testPayload, // This simulates form data
    postData: {
      type: "text/plain;charset=utf-8",
      contents: JSON.stringify(testPayload),
    },
  };

  try {
    Logger.log("Calling doPost with test data...");
    var result = doPost(simulatedEvent);
    Logger.log("✅ Test result: " + result.getContent());
    Logger.log("✅ Test completed! Check your Google Sheet for the new row.");
    return result;
  } catch (err) {
    Logger.log("❌ Test failed with error: " + err);
    Logger.log("Error stack: " + err.stack);
    throw err;
  }
}
/**
 * Manual test function - Add a row directly
 */
function testDirectInsert() {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      Logger.log("Sheet not found: " + SHEET_NAME);
      return;
    }

    var testData = [
      new Date(),
      "TEST-" + new Date().getTime(),
      "Direct Test User",
      "30",
      "directtest@example.com",
      "+212612345678",
      "Cohort 12",
      "Software Engineering",
      "Hub Casablanca - Technopark",
      "Event Coordinator",
      "6-8 hours/week",
      "Testing direct insertion to Google Sheet",
      "No previous experience",
      "https://example.com",
    ];

    sheet.appendRow(testData);
    Logger.log("✅ Direct insert successful! Check your sheet.");
  } catch (err) {
    Logger.log("❌ Direct insert failed: " + err);
  }
}
