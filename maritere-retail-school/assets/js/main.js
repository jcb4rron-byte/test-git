/* Maritere Retail School — interacciones mínimas (sin dependencias) */
(function () {
  "use strict";

  // Menú móvil
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Preselección de curso desde ?curso=slug (enlaces del catálogo)
  var select = document.getElementById("curso");
  if (select) {
    var match = /[?&]curso=([^&]+)/.exec(window.location.search);
    if (match) select.value = decodeURIComponent(match[1]);
  }

  // Año del pie
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
