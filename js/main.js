(function () {
  "use strict";

  var menuToggle = document.querySelector(".menu-toggle");
  var mobileDrawer = document.querySelector(".mobile-drawer");

  if (menuToggle && mobileDrawer) {
    var backdrop = document.getElementById("mobile-nav-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "mobile-nav-backdrop";
      backdrop.className = "mobile-nav-backdrop";
      backdrop.setAttribute("tabindex", "-1");
      backdrop.setAttribute("aria-hidden", "true");
      document.body.appendChild(backdrop);
    }

    function setNavOpen(open) {
      mobileDrawer.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mobileDrawer.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.classList.toggle("mobile-nav-open", open);
      backdrop.classList.toggle("is-active", open);
      backdrop.setAttribute("aria-hidden", open ? "false" : "true");
    }

    mobileDrawer.setAttribute("aria-hidden", "true");

    menuToggle.addEventListener("click", function () {
      var open = !mobileDrawer.classList.contains("is-open");
      setNavOpen(open);
    });

    backdrop.addEventListener("click", function () {
      if (mobileDrawer.classList.contains("is-open")) {
        setNavOpen(false);
        menuToggle.focus();
      }
    });

    mobileDrawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileDrawer.classList.contains("is-open")) {
        setNavOpen(false);
        menuToggle.focus();
      }
    });

    window.addEventListener(
      "resize",
      function () {
        if (window.matchMedia("(min-width: 900px)").matches) {
          setNavOpen(false);
        }
      },
      { passive: true }
    );
  }

  document.querySelectorAll(".faq-item button").forEach(function (btn) {
    var panel = btn.parentElement.querySelector(".faq-panel");
    if (!panel) return;

    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      panel.classList.toggle("is-open", !expanded);
    });
  });

  var demoForm = document.querySelector("form[data-demo-form]");
  if (demoForm) {
    demoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!demoForm.checkValidity()) {
        demoForm.reportValidity();
        return;
      }

      var submitBtn = demoForm.querySelector('button[type="submit"]');
      var alertEl = document.getElementById("contact-form-alert");
      var originalLabel = submitBtn ? submitBtn.textContent : "";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
      if (alertEl) {
        alertEl.hidden = true;
        alertEl.classList.remove("form-alert--error", "form-alert--success");
      }

      window.setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
        demoForm.reset();
        if (alertEl) {
          alertEl.hidden = false;
          alertEl.textContent =
            "Thank you! Your message has been sent. A member of our team will respond as soon as possible.";
          alertEl.classList.add("form-alert--success");
          alertEl.setAttribute("role", "status");
          alertEl.focus();
        }
      }, 900);
    });
  }
})();
