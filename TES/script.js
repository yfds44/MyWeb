/* Tema gelap/terang + lightbox foto.
   Tidak ada preloader palsu dan tidak ada animasi scroll. */

(function () {
  "use strict";

  /* ---------- Tema ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("themeToggle");

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function paintThemeButton() {
    if (!themeBtn) return;
    var dark = currentTheme() === "dark";
    themeBtn.setAttribute("aria-pressed", String(dark));
    themeBtn.textContent = dark ? "Mode terang" : "Mode gelap";
  }

  if (themeBtn) {
    paintThemeButton();
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      paintThemeButton();
    });
  }

  /* ---------- Lightbox ---------- */
  var box = document.getElementById("lightbox");
  if (!box || typeof box.showModal !== "function") return;

  var img = box.querySelector(".lightbox__img");
  var count = box.querySelector(".lightbox__count");
  var prev = box.querySelector(".lightbox__prev");
  var next = box.querySelector(".lightbox__next");
  var closeBtn = box.querySelector(".lightbox__close");

  var gallery = [];
  var index = 0;
  var label = "";

  function show() {
    img.src = gallery[index];
    img.alt = label + " (foto " + (index + 1) + " dari " + gallery.length + ")";
    var many = gallery.length > 1;
    prev.hidden = !many;
    next.hidden = !many;
    count.textContent = many ? index + 1 + " / " + gallery.length : "";
  }

  function step(delta) {
    if (gallery.length < 2) return;
    index = (index + delta + gallery.length) % gallery.length;
    show();
  }

  document.querySelectorAll(".thumb[data-images]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      gallery = btn.getAttribute("data-images").split("|").map(function (s) {
        return s.trim();
      }).filter(Boolean);
      label = btn.getAttribute("data-label") || "Foto";
      index = 0;
      show();
      box.showModal();
    });
  });

  prev.addEventListener("click", function () { step(-1); });
  next.addEventListener("click", function () { step(1); });
  closeBtn.addEventListener("click", function () { box.close(); });

  /* Klik area gelap di luar foto menutup */
  box.addEventListener("click", function (e) {
    if (e.target === box) box.close();
  });

  /* Esc sudah ditangani <dialog>; panah kiri/kanan ditambahkan di sini */
  box.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  box.addEventListener("close", function () { img.removeAttribute("src"); });
})();
