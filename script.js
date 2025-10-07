// ALX Morocco Tech Club - Form JavaScript Functionality

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("volunteerForm");
  const submitBtn = document.getElementById("submitBtn");
  const successMessage = document.getElementById("successMessage");
  const formContainer = document.querySelector(".form-container");

  // Form validation patterns
  const validationRules = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[\s\-\(\)]?[\d\s\-\(\)]{8,}$/,
    url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  };

  // Initialize form enhancements
  initializeFormEnhancements();
  setupFormValidation();
  setupFormSubmission();

  function initializeFormEnhancements() {
    // Add floating labels effect
    const inputs = document.querySelectorAll(
      ".form-input, .form-select, .form-textarea"
    );
    inputs.forEach((input) => {
      // Handle focus and blur events
      input.addEventListener("focus", handleInputFocus);
      input.addEventListener("blur", handleInputBlur);
      input.addEventListener("input", handleInputChange);

      // Initialize state
      if (input.value.trim() !== "") {
        input.classList.add("has-value");
      }
    });

    // Add role card hover effects
    const roleLabels = document.querySelectorAll(".role-label");
    roleLabels.forEach((label) => {
      label.addEventListener("mouseenter", () => {
        label.style.transform = "translateY(-4px)";
      });
      label.addEventListener("mouseleave", () => {
        if (!label.previousElementSibling.checked) {
          label.style.transform = "translateY(0)";
        }
      });
    });

    // Add smooth scroll for form sections
    const sectionTitles = document.querySelectorAll(".section-title");
    sectionTitles.forEach((title) => {
      title.addEventListener("click", () => {
        title.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });

    // Add progress indicator
    addProgressIndicator();
  }

  function handleInputFocus(e) {
    const input = e.target;
    input.classList.add("focused");

    // Add ripple effect
    createRippleEffect(input);
  }

  function handleInputBlur(e) {
    const input = e.target;
    input.classList.remove("focused");

    if (input.value.trim() !== "") {
      input.classList.add("has-value");
    } else {
      input.classList.remove("has-value");
    }

    // Validate field on blur
    validateField(input);
  }

  function handleInputChange(e) {
    const input = e.target;

    if (input.value.trim() !== "") {
      input.classList.add("has-value");
    } else {
      input.classList.remove("has-value");
    }

    // Clear previous error state
    clearFieldError(input);

    // Update progress
    updateProgress();
  }

  function createRippleEffect(element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = rect.width / 2 - size / 2 + "px";
    ripple.style.top = rect.height / 2 - size / 2 + "px";
    ripple.classList.add("ripple");

    // Add ripple styles
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "rgba(48, 63, 159, 0.1)";
    ripple.style.transform = "scale(0)";
    ripple.style.animation = "ripple 0.6s linear";
    ripple.style.pointerEvents = "none";

    element.style.position = "relative";
    element.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  function setupFormValidation() {
    const requiredFields = document.querySelectorAll("[required]");

    requiredFields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => clearFieldError(field));
    });

    // Email validation
    const emailField = document.getElementById("email");
    if (emailField) {
      emailField.addEventListener("input", () => {
        if (emailField.value && !validationRules.email.test(emailField.value)) {
          showFieldError(emailField, "Please enter a valid email address");
        }
      });
    }

    // Phone validation
    const phoneField = document.getElementById("phoneNumber");
    if (phoneField) {
      phoneField.addEventListener("input", () => {
        if (phoneField.value && !validationRules.phone.test(phoneField.value)) {
          showFieldError(phoneField, "Please enter a valid phone number");
        }
      });
    }

    // URL validation
    const urlField = document.getElementById("resourceLink");
    if (urlField) {
      urlField.addEventListener("input", () => {
        if (urlField.value && !validationRules.url.test(urlField.value)) {
          showFieldError(urlField, "Please enter a valid URL");
        }
      });
    }

    // Age validation
    const ageField = document.getElementById("age");
    if (ageField) {
      ageField.addEventListener("input", () => {
        const age = parseInt(ageField.value);
        if (age && (age < 16 || age > 100)) {
          showFieldError(ageField, "Age must be between 16 and 100");
        }
      });
    }
  }

  function validateField(field) {
    const value = field.value.trim();

    // Check required fields
    if (field.hasAttribute("required") && !value) {
      showFieldError(field, "This field is required");
      return false;
    }

    // Check specific validation rules
    if (field.type === "email" && value && !validationRules.email.test(value)) {
      showFieldError(field, "Please enter a valid email address");
      return false;
    }

    if (field.type === "tel" && value && !validationRules.phone.test(value)) {
      showFieldError(field, "Please enter a valid phone number");
      return false;
    }

    if (field.type === "url" && value && !validationRules.url.test(value)) {
      showFieldError(field, "Please enter a valid URL");
      return false;
    }

    if (field.type === "number") {
      const num = parseInt(value);
      const min = parseInt(field.min);
      const max = parseInt(field.max);

      if (value && (num < min || num > max)) {
        showFieldError(field, `Value must be between ${min} and ${max}`);
        return false;
      }
    }

    // Check radio button groups
    if (field.type === "radio") {
      const radioGroup = document.querySelectorAll(
        `input[name="${field.name}"]`
      );
      const isChecked = Array.from(radioGroup).some((radio) => radio.checked);

      if (!isChecked) {
        showFieldError(field, "Please select an option");
        return false;
      }
    }

    clearFieldError(field);
    return true;
  }

  function showFieldError(field, message) {
    clearFieldError(field);

    field.classList.add("error");

    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.textContent = message;
    errorDiv.style.color = "#ef4444";
    errorDiv.style.fontSize = "0.85rem";
    errorDiv.style.marginTop = "0.25rem";
    errorDiv.style.display = "flex";
    errorDiv.style.alignItems = "center";
    errorDiv.style.gap = "0.25rem";

    const icon = document.createElement("i");
    icon.className = "fas fa-exclamation-circle";
    errorDiv.insertBefore(icon, errorDiv.firstChild);

    const formGroup = field.closest(".form-group");
    if (formGroup) {
      formGroup.appendChild(errorDiv);
    }

    // Add error styles to input
    field.style.borderColor = "#ef4444";
    field.style.backgroundColor = "#fef2f2";
  }

  function clearFieldError(field) {
    field.classList.remove("error");
    field.style.borderColor = "";
    field.style.backgroundColor = "";

    const formGroup = field.closest(".form-group");
    if (formGroup) {
      const errorDiv = formGroup.querySelector(".field-error");
      if (errorDiv) {
        errorDiv.remove();
      }
    }
  }

  function addProgressIndicator() {
    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";
    progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
            <div class="progress-text" id="progressText">0% Complete</div>
        `;

    // Add styles
    progressContainer.style.position = "sticky";
    progressContainer.style.top = "0";
    progressContainer.style.zIndex = "100";
    progressContainer.style.background = "white";
    progressContainer.style.padding = "1rem";
    progressContainer.style.borderBottom = "1px solid #e5e7eb";
    progressContainer.style.marginBottom = "2rem";

    const progressBar = progressContainer.querySelector(".progress-bar");
    progressBar.style.width = "100%";
    progressBar.style.height = "8px";
    progressBar.style.backgroundColor = "#e5e7eb";
    progressBar.style.borderRadius = "4px";
    progressBar.style.overflow = "hidden";
    progressBar.style.marginBottom = "0.5rem";

    const progressFill = progressContainer.querySelector(".progress-fill");
    progressFill.style.width = "0%";
    progressFill.style.height = "100%";
    progressFill.style.background =
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    progressFill.style.borderRadius = "4px";
    progressFill.style.transition = "width 0.3s ease-in-out";

    const progressText = progressContainer.querySelector(".progress-text");
    progressText.style.fontSize = "0.875rem";
    progressText.style.color = "#6b7280";
    progressText.style.textAlign = "center";

    formContainer.insertBefore(progressContainer, form);

    // Initial progress update
    updateProgress();
  }

  function updateProgress() {
    const allFields = form.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );
    const filledFields = Array.from(allFields).filter((field) => {
      if (field.type === "radio") {
        const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
        return Array.from(radioGroup).some((radio) => radio.checked);
      }
      return field.value.trim() !== "";
    });

    const progress = Math.round((filledFields.length / allFields.length) * 100);

    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");

    if (progressFill && progressText) {
      progressFill.style.width = progress + "%";
      progressText.textContent = progress + "% Complete";

      // Change color based on progress
      if (progress === 100) {
        progressFill.style.background =
          "linear-gradient(135deg, #10b981 0%, #059669 100%)";
        progressText.style.color = "#065f46";
        progressText.innerHTML =
          '<i class="fas fa-check-circle"></i> Form Complete!';
      } else if (progress >= 75) {
        progressFill.style.background =
          "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
      } else {
        progressFill.style.background =
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      }
    }
  }

  function setupFormSubmission() {
    form.addEventListener("submit", handleFormSubmit);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const allFields = form.querySelectorAll("input, select, textarea");
    let isValid = true;

    allFields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      // Scroll to first error
      const firstError = form.querySelector(".error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Show error notification
      showNotification("Please fix the errors before submitting", "error");
      return;
    }

    // Show loading state
    setLoadingState(true);

    try {
      // Prepare form data
      const formData = new FormData(form);

      // Add metadata for better organization
      formData.append("_subject", "New ALX Tech Club Volunteer Application");
      formData.append("_template", "table");
      formData.append("_format", "plain");
      formData.append("_timestamp", new Date().toISOString());

      // Submit to Submit.json (FREE unlimited submissions)
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        // Show success message
        showSuccessMessage();

        // Reset form
        form.reset();
        updateProgress();

        // Track successful submission
        console.log("Form submitted successfully");

        // Optional: Send to Google Sheets or Excel Online
        await sendToExcel(formData);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showNotification(
        "There was an error submitting your application. Please try again.",
        "error"
      );
    } finally {
      setLoadingState(false);
    }
  }

  async function sendToExcel(formData) {
    // This function can be used to send data to Excel Online via Microsoft Graph API
    // or other Excel integration services. For now, we'll use a webhook approach.

    try {
      const data = {};
      for (let [key, value] of formData.entries()) {
        if (!key.startsWith("_")) {
          // Skip Formspree metadata
          data[key] = value;
        }
      }

      // Add timestamp
      data.submissionDate = new Date().toISOString();
      data.timestamp = new Date().toLocaleString();

      // You can integrate with services like:
      // - Microsoft Power Automate (Flow)
      // - Zapier
      // - Google Sheets API
      // - Excel Online API

      console.log("Data prepared for Excel:", data);

      // Example webhook call (replace with your actual endpoint)
      // await fetch('YOUR_WEBHOOK_URL', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(data)
      // });
    } catch (error) {
      console.error("Excel integration error:", error);
      // Don't show error to user as the main form submission succeeded
    }
  }

  function setLoadingState(loading) {
    if (loading) {
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;
      form.classList.add("form-loading");
    } else {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      form.classList.remove("form-loading");
    }
  }

  function showSuccessMessage() {
    form.style.display = "none";
    successMessage.style.display = "block";

    // Scroll to success message
    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });

    // Add celebration animation
    createCelebrationEffect();
  }

  function createCelebrationEffect() {
    // Create confetti effect
    const colors = ["#667eea", "#764ba2", "#ff6d00", "#ffd700"];

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.style.position = "fixed";
        confetti.style.width = "8px";
        confetti.style.height = "8px";
        confetti.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + "px";
        confetti.style.top = "-10px";
        confetti.style.borderRadius = "50%";
        confetti.style.pointerEvents = "none";
        confetti.style.zIndex = "1000";
        confetti.style.animation = `fall 3s linear forwards`;

        document.body.appendChild(confetti);

        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
          }
        }, 3000);
      }, i * 50);
    }
  }

  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <i class="fas fa-${
              type === "error" ? "exclamation-circle" : "info-circle"
            }"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

    // Add styles
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.background = type === "error" ? "#ef4444" : "#3b82f6";
    notification.style.color = "white";
    notification.style.padding = "1rem 1.5rem";
    notification.style.borderRadius = "8px";
    notification.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    notification.style.zIndex = "1001";
    notification.style.display = "flex";
    notification.style.alignItems = "center";
    notification.style.gap = "0.5rem";
    notification.style.maxWidth = "400px";
    notification.style.animation = "slideInRight 0.3s ease-out";

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "slideOutRight 0.3s ease-out";
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  }

  // Add CSS animations
  const style = document.createElement("style");
  style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes fall {
            to {
                transform: translateY(${
                  window.innerHeight + 20
                }px) rotateZ(360deg);
                opacity: 0;
            }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            margin-left: 0.5rem;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;

  document.head.appendChild(style);
});

// Additional utility functions
function formatPhoneNumber(phone) {
  // Simple phone number formatting
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

function validateMoroccanPhone(phone) {
  // Validate Moroccan phone numbers
  const cleaned = phone.replace(/\D/g, "");
  return /^(0[5-7]\d{8}|(\+212|00212)[5-7]\d{8})$/.test(phone);
}

// Initialize smooth scrolling for better UX
function initSmoothScrolling() {
  document.documentElement.style.scrollBehavior = "smooth";
}

// Call initialization functions
initSmoothScrolling();
