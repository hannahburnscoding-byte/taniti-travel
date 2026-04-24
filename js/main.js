(function () {
  "use strict";

  var menuToggle = document.querySelector(".menu-toggle");
  var mobileDrawer = document.querySelector(".mobile-drawer");

  if (menuToggle && mobileDrawer) {
    mobileDrawer.setAttribute("aria-hidden", "true");

    menuToggle.addEventListener("click", function () {
      var open = mobileDrawer.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      mobileDrawer.setAttribute("aria-hidden", open ? "false" : "true");
    });

    mobileDrawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileDrawer.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        mobileDrawer.setAttribute("aria-hidden", "true");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileDrawer.classList.contains("is-open")) {
        mobileDrawer.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        mobileDrawer.setAttribute("aria-hidden", "true");
        menuToggle.focus();
      }
    });
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
    });
  }
})();
