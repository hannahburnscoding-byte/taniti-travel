(function () {
  "use strict";

  var form = document.getElementById("booking-form");
  if (!form) return;

  var alertBox = document.getElementById("booking-form-alert");
  var submitBtn = form.querySelector('button[type="submit"]');

  function showAlert(message, isError) {
    if (!alertBox) return;
    alertBox.hidden = false;
    alertBox.textContent = message;
    alertBox.classList.toggle("form-alert--error", !!isError);
    alertBox.classList.toggle("form-alert--success", !isError);
    alertBox.setAttribute("role", isError ? "alert" : "status");
    alertBox.focus();
  }

  function clearFieldErrors() {
    form.querySelectorAll(".field-error").forEach(function (el) {
      el.textContent = "";
      el.hidden = true;
    });
    form.querySelectorAll(".is-invalid").forEach(function (el) {
      el.classList.remove("is-invalid");
    });
  }

  function setFieldError(fieldId, msg) {
    var field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.add("is-invalid");
    var err = document.getElementById(fieldId + "-error");
    if (err) {
      err.textContent = msg;
      err.hidden = false;
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearFieldErrors();

    if (alertBox) {
      alertBox.hidden = true;
      alertBox.classList.remove("form-alert--error", "form-alert--success");
    }

    var fd = new FormData(form);
    var fullName = (fd.get("full_name") || "").toString().trim();
    var email = (fd.get("email") || "").toString().trim();
    var checkIn = (fd.get("check_in") || "").toString();
    var checkOut = (fd.get("check_out") || "").toString();
    var adults = parseInt(fd.get("adults"), 10);
    var children = parseInt(fd.get("children"), 10) || 0;
    var lodgingType = (fd.get("lodging_type") || "").toString().trim();

    var ok = true;
    if (fullName.length < 2) {
      setFieldError("full_name", "Please enter your full name.");
      ok = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError("email", "Please enter a valid email address.");
      ok = false;
    }
    if (!checkIn) {
      setFieldError("check_in", "Choose a check-in date.");
      ok = false;
    }
    if (!checkOut) {
      setFieldError("check_out", "Choose a check-out date.");
      ok = false;
    }
    if (checkIn && checkOut && checkOut <= checkIn) {
      setFieldError("check_out", "Check-out must be after check-in.");
      ok = false;
    }
    if (!adults || adults < 1 || adults > 20) {
      setFieldError("adults", "Enter the number of adults (1–20).");
      ok = false;
    }
    if (children < 0 || children > 20) {
      setFieldError("children", "Enter a valid number of children (0–20).");
      ok = false;
    }
    if (!lodgingType) {
      setFieldError("lodging_type", "Please select a lodging type.");
      ok = false;
    }
    var consentEl = document.getElementById("consent");
    if (!consentEl || !consentEl.checked) {
      showAlert("Please confirm that your details are correct before submitting.", true);
      ok = false;
    }

    if (!ok) {
      showAlert("Please fix the highlighted fields.", true);
      return;
    }

    var originalLabel = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    window.setTimeout(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
      form.reset();
      showAlert(
        "Thank you! Your booking request has been submitted. We will confirm availability by email within two business days.",
        false
      );
    }, 900);
  });
})();
