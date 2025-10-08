// ========== CONFIGURATION ==========
const SHEET_ID = "1DyDhpc5yoIe2sTULdVaiy8A2cderoor4sngKYQ3Se6c";
const SHEET_NAME = "Feuille 1";
const LOGS_SHEET_NAME = "Logs";
// ===================================

// ========== LOGGING INFRASTRUCTURE ==========

/**
 * Ensure Logs sheet exists, create if missing
 */
function ensureLogsSheet() {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var logsSheet = ss.getSheetByName(LOGS_SHEET_NAME);

    if (!logsSheet) {
      // Create new Logs sheet
      logsSheet = ss.insertSheet(LOGS_SHEET_NAME);

      // Add headers
      logsSheet.appendRow(["Timestamp", "Level", "Message", "Details"]);

      // Format headers
      var headerRange = logsSheet.getRange("A1:D1");
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4285f4");
      headerRange.setFontColor("#ffffff");

      // Set column widths
      logsSheet.setColumnWidth(1, 180); // Timestamp
      logsSheet.setColumnWidth(2, 100); // Level
      logsSheet.setColumnWidth(3, 300); // Message
      logsSheet.setColumnWidth(4, 400); // Details

      // Freeze header row
      logsSheet.setFrozenRows(1);
    }

    return logsSheet;
  } catch (err) {
    // Silently fail - don't break form submission if logging fails
    console.log("Warning: Could not create logs sheet: " + err.message);
    return null;
  }
}

/**
 * Write log entry to Logs sheet
 */
function logToSheet(level, message, details) {
  try {
    var logsSheet = ensureLogsSheet();
    if (!logsSheet) return; // Logging disabled if sheet can't be created

    var timestamp = new Date();
    var detailsStr = "";

    // Convert details object to JSON string
    if (details) {
      try {
        detailsStr =
          typeof details === "object"
            ? JSON.stringify(details)
            : String(details);
      } catch (e) {
        detailsStr = String(details);
      }
    }

    // Add emoji prefix based on level
    var levelWithEmoji = level;
    switch (level) {
      case "SUCCESS":
        levelWithEmoji = "✅ " + level;
        break;
      case "ERROR":
        levelWithEmoji = "❌ " + level;
        break;
      case "WARNING":
        levelWithEmoji = "⚠️ " + level;
        break;
      case "INFO":
        levelWithEmoji = "ℹ️ " + level;
        break;
    }

    // Append log row
    logsSheet.appendRow([timestamp, levelWithEmoji, message, detailsStr]);

    // Optional: Keep only last 1000 log entries to prevent sheet bloat
    var lastRow = logsSheet.getLastRow();
    if (lastRow > 1001) {
      // 1000 logs + 1 header
      logsSheet.deleteRows(2, lastRow - 1001);
    }
  } catch (err) {
    // Silently fail - don't break form submission if logging fails
    console.log("Warning: Could not write to logs sheet: " + err.message);
  }
}

/**
 * Dual logging - writes to both console and sheet
 */
function log(level, message, details) {
  // Console logging (backup for when Cloud Logs work)
  var emoji = "";
  switch (level) {
    case "SUCCESS":
      emoji = "✅";
      break;
    case "ERROR":
      emoji = "❌";
      break;
    case "WARNING":
      emoji = "⚠️";
      break;
    case "INFO":
      emoji = "ℹ️";
      break;
  }

  var consoleMsg = emoji + " " + message;
  if (details) {
    console.log(consoleMsg, details);
  } else {
    console.log(consoleMsg);
  }

  // Sheet logging (persistent and always visible)
  logToSheet(level, message, details);
}

// ========================================

/**
 * doPost - Receives form submissions from your website
 */
function doPost(e) {
  try {
    log("INFO", "========================================");
    log("INFO", "NEW FORM SUBMISSION RECEIVED", {
      timestamp: new Date().toISOString(),
      contentType: e.postData ? e.postData.type : "undefined",
    });
    log("INFO", "========================================");

    // Parse the incoming payload
    var payload = parsePayload(e);
    log("SUCCESS", "Payload parsed successfully", {
      fieldCount: Object.keys(payload).length,
      fields: Object.keys(payload).join(", "),
    });

    // Validate required fields
    var errors = validatePayload(payload);
    if (errors.length > 0) {
      log("ERROR", "VALIDATION FAILED", {
        errorCount: errors.length,
        errors: errors,
      });
      return jsonResponse({ status: "error", errors: errors }, 400);
    }
    log("SUCCESS", "Validation passed");

    // Normalize and sanitize data
    payload = normalizePayload(payload);
    log("SUCCESS", "Data normalized", {
      submissionId: payload.submissionId,
    });

    // Append to Google Sheet
    log("INFO", "Attempting to append to Google Sheet...");
    appendToSheet(payload);

    log("INFO", "========================================");
    log("SUCCESS", "Data saved to Google Sheet", {
      submissionId: payload.submissionId,
      email: payload.email,
      role: payload.volunteerRole,
    });
    log("INFO", "========================================");

    return jsonResponse(
      { status: "success", message: "Application submitted successfully!" },
      200
    );
  } catch (err) {
    log("INFO", "========================================");
    log("ERROR", "ERROR IN doPost", {
      message: err.message,
      stack: err.stack || "No stack trace",
    });
    log("INFO", "========================================");

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
    log("INFO", "=== PARSING PAYLOAD ===");
    log("INFO", "Request metadata", {
      contentType: e.postData ? e.postData.type : "undefined",
      hasParameter: !!e.parameter,
      hasPostData: !!e.postData,
    });

    // Try to get raw data string first
    if (e.postData) {
      var rawData = e.postData.getDataAsString();
      log("INFO", "Received POST data", {
        dataLength: rawData.length,
      });

      // Try parsing as JSON (works for both text/plain and application/json)
      if (rawData && rawData.length > 0) {
        try {
          const parsed = JSON.parse(rawData);
          log("SUCCESS", "Successfully parsed as JSON", {
            method: "direct",
            fieldCount: Object.keys(parsed).length,
          });
          return parsed;
        } catch (jsonError) {
          log("WARNING", "Not valid JSON, trying URL decode", {
            error: jsonError.message,
          });

          // Try URL decoding first, then parse
          try {
            const decoded = decodeURIComponent(rawData);
            const parsed = JSON.parse(decoded);
            log("SUCCESS", "Successfully parsed after URL decode");
            return parsed;
          } catch (decodeError) {
            log("WARNING", "URL decode failed", {
              error: decodeError.message,
            });
          }
        }
      }
    }

    // Try postData.contents (legacy support)
    if (e.postData && e.postData.contents) {
      log("INFO", "Trying postData.contents");
      const parsed = JSON.parse(e.postData.contents);
      log("SUCCESS", "Parsed from postData.contents");
      return parsed;
    }

    // Fall back to e.parameter (for test submissions and form-encoded data)
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      log("SUCCESS", "Using e.parameter", {
        fieldCount: Object.keys(e.parameter).length,
      });
      return e.parameter;
    }

    throw new Error("No valid payload found in request");
  } catch (error) {
    log("ERROR", "Error in parsePayload", {
      message: error.message,
      stack: error.stack,
    });
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

    log("SUCCESS", "Row appended to sheet successfully", {
      sheetName: SHEET_NAME,
      submissionId: payload.submissionId,
      rowNumber: sheet.getLastRow(),
    });
  } catch (err) {
    log("ERROR", "Error appending to sheet", {
      error: err.message,
      stack: err.stack || "No stack trace",
    });
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
  log("INFO", "=== Starting test submission ===");

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
  // Using e.parameter approach (simpler and works with fallback logic)
  var simulatedEvent = {
    parameter: testPayload, // This simulates form data
  };

  try {
    log("INFO", "Calling doPost with test data...");
    var result = doPost(simulatedEvent);
    log("SUCCESS", "Test completed! Check your Google Sheet for the new row.", {
      result: result.getContent(),
    });
    return result;
  } catch (err) {
    log("ERROR", "Test failed", {
      error: err.message,
      stack: err.stack,
    });
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
      log("ERROR", "Sheet not found: " + SHEET_NAME);
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
    log("SUCCESS", "Direct insert successful! Check your sheet.", {
      rowNumber: sheet.getLastRow(),
    });
  } catch (err) {
    log("ERROR", "Direct insert failed", {
      error: err.message,
    });
  }
}
