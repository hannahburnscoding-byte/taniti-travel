(function () {
  "use strict";

  var form = document.getElementById("booking-form");
  if (!form) return;

  var alertBox = document.getElementById("booking-form-alert");
  var summaryPre = document.getElementById("booking-summary-text");
  var copyBtn = document.getElementById("booking-copy-summary");

  function showAlert(message, isError) {
    if (!alertBox) return;
    alertBox.hidden = false;
    alertBox.textContent = message;
    alertBox.classList.toggle("form-alert--error", !!isError);
    alertBox.classList.toggle("form-alert--success", !isError);
    alertBox.setAttribute("role", "alert");
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

  function buildSummary(fd) {
    var lines = [
      "Taniti — booking request",
      "------------------------",
      "Name: " + fd.get("full_name"),
      "Email: " + fd.get("email"),
      "Phone: " + (fd.get("phone") || "—"),
      "Check-in: " + fd.get("check_in"),
      "Check-out: " + fd.get("check_out"),
      "Guests: " + fd.get("adults") + " adults, " + fd.get("children") + " children",
      "Lodging: " + fd.get("lodging_type"),
      "Area: " + fd.get("area_preference"),
      "Airport transfer: " + (fd.get("airport_transfer") ? "Yes" : "No"),
      "Flight arrival (if known): " + (fd.get("arrival_info") || "—"),
      "Notes: " + (fd.get("requests") || "—"),
    ];
    return lines.join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearFieldErrors();

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
      showAlert("Please confirm that your details are correct before sending.", true);
      ok = false;
    }

    if (!ok) {
      showAlert("Please fix the highlighted fields.", true);
      return;
    }

    var recipient = (form.getAttribute("data-recipient-email") || "").trim();
    if (!recipient || recipient.indexOf("@") === -1) {
      showAlert(
        "Booking email is not configured. Set data-recipient-email on the form to your inbox address.",
        true
      );
      return;
    }

    var summary = buildSummary(fd);
    var subject = encodeURIComponent("Taniti booking request — " + fullName + " — " + checkIn);
    var body = encodeURIComponent(summary);
    var mailto = "mailto:" + encodeURIComponent(recipient) + "?subject=" + subject + "&body=" + body;

    if (mailto.length > 1900) {
      body = encodeURIComponent(summary.slice(0, 1500) + "\n…(trimmed; see copied summary below)");
      mailto = "mailto:" + encodeURIComponent(recipient) + "?subject=" + subject + "&body=" + body;
    }

    if (summaryPre) summaryPre.textContent = summary;
    var fall = document.getElementById("booking-summary-fallback");
    if (fall) fall.hidden = false;

    showAlert(
      "Your email app should open with this request ready to send. If nothing opens, copy the summary below and email " +
        recipient +
        " manually.",
      false
    );

    setTimeout(function () {
      window.location.href = mailto;
    }, 250);
  });

  if (copyBtn && summaryPre) {
    copyBtn.addEventListener("click", function () {
      var text = summaryPre.textContent || "";
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          copyBtn.textContent = "Copied!";
          setTimeout(function () {
            copyBtn.textContent = "Copy request text";
          }, 2000);
        });
      } else {
        summaryPre.select();
        document.execCommand("copy");
      }
    });
  }
})();
