/* ==========================================================================
   Bradley Schalk — Engineering Portfolio
   Vanilla JS. No dependencies, no build step.

   Two features:
     1. Mobile navigation toggle
     2. Accessible image lightbox (click, Escape, arrow keys, focus return)
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */

  function initNav() {
    var toggle = document.querySelector(".nav__toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;

    function close() {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close after tapping a link, and when returning to desktop width.
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        close();
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     Lightbox

     Any button with [data-lightbox] opens. Grouping comes from the closest
     [data-gallery] ancestor, so prev/next only cycles within one gallery.

     Each trigger supplies:
       data-full    path to the large image
       data-caption caption text (falls back to the figcaption)
       data-cad     present if the image is a CAD/CAM screenshot (light backing)
     ---------------------------------------------------------------------- */

  function initLightbox() {
    var triggers = Array.prototype.slice.call(
      document.querySelectorAll("[data-lightbox]")
    );
    if (!triggers.length) return;

    var box = document.getElementById("lightbox");
    if (!box) return;

    var imgEl = box.querySelector(".lightbox__stage img");
    var capEl = box.querySelector(".lightbox__caption");
    var countEl = box.querySelector(".lightbox__count");
    var btnClose = box.querySelector(".lightbox__close");
    var btnPrev = box.querySelector(".lightbox__prev");
    var btnNext = box.querySelector(".lightbox__next");

    var group = [];
    var index = 0;
    var lastFocused = null;

    function captionFor(el) {
      if (el.dataset.caption) return el.dataset.caption;
      var fig = el.closest("figure");
      var cap = fig && fig.querySelector("figcaption");
      return cap ? cap.textContent.trim() : "";
    }

    function show(i) {
      var el = group[i];
      if (!el) return;
      index = i;

      var full = el.dataset.full || el.querySelector("img").src;
      var alt = el.querySelector("img") ? el.querySelector("img").alt : "";

      imgEl.src = full;
      imgEl.alt = alt;
      imgEl.classList.toggle("is-cad", el.hasAttribute("data-cad"));
      capEl.textContent = captionFor(el);

      var many = group.length > 1;
      countEl.textContent = many ? i + 1 + " / " + group.length : "";
      btnPrev.hidden = !many;
      btnNext.hidden = !many;
    }

    function open(el) {
      var container = el.closest("[data-gallery]");
      group = container
        ? Array.prototype.slice.call(container.querySelectorAll("[data-lightbox]"))
        : [el];

      lastFocused = el;
      show(group.indexOf(el));

      box.classList.add("is-open");
      box.setAttribute("aria-hidden", "false");
      document.body.classList.add("lb-open");
      btnClose.focus();
    }

    function close() {
      box.classList.remove("is-open");
      box.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lb-open");
      imgEl.removeAttribute("src");
      if (lastFocused) lastFocused.focus();
    }

    function step(delta) {
      if (group.length < 2) return;
      show((index + delta + group.length) % group.length);
    }

    triggers.forEach(function (el) {
      el.addEventListener("click", function () {
        open(el);
      });
    });

    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", function () { step(-1); });
    btnNext.addEventListener("click", function () { step(1); });

    // Click the dim background (but not the image) to dismiss.
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("lightbox__stage")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;

      if (e.key === "Escape") { close(); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); return; }

      // Keep focus inside the dialog while it is open.
      if (e.key === "Tab") {
        var focusable = Array.prototype.filter.call(
          box.querySelectorAll("button:not([hidden])"),
          function (b) { return b.offsetParent !== null; }
        );
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Basic swipe support on touch devices.
    var startX = null;
    box.addEventListener("touchstart", function (e) {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });

    box.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 55) step(dx < 0 ? 1 : -1);
      startX = null;
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     Only one video plays at a time.
     ---------------------------------------------------------------------- */

  function initVideos() {
    var videos = Array.prototype.slice.call(document.querySelectorAll("video"));
    videos.forEach(function (v) {
      v.addEventListener("play", function () {
        videos.forEach(function (other) {
          if (other !== v && !other.paused) other.pause();
        });
      });
    });
  }

  /* ---------------------------------------------------------------------- */

  function init() {
    initNav();
    initLightbox();
    initVideos();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
