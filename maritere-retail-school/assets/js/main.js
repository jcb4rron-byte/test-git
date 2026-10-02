/* Maritere Retail School — interacciones mínimas (sin dependencias) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

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

  // Revelado progresivo, como la apertura de un escaparate
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Preselección de programa desde ?programa=slug
  var select = document.getElementById("programa");
  if (select) {
    var match = /[?&]programa=([^&]+)/.exec(window.location.search);
    if (match) select.value = decodeURIComponent(match[1]);
  }

  // Año del pie
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
