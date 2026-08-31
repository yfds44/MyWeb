document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================
   NAVBAR DROPDOWN
   ========================================================== */

  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");

      navToggle.setAttribute("aria-expanded", String(isOpen));

      navMenu.setAttribute("aria-hidden", String(!isOpen));
    });

    /* Tutup menu ketika salah satu link diklik */

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");

        navToggle.setAttribute("aria-expanded", "false");

        navMenu.setAttribute("aria-hidden", "true");
      });
    });

    /* Tutup jika klik di luar navbar */

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".navbar")) {
        navMenu.classList.remove("is-open");

        navToggle.setAttribute("aria-expanded", "false");

        navMenu.setAttribute("aria-hidden", "true");
      }
    });
  }

  const navbar = document.getElementById("navbar");
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  const revealEls = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
      );
      revealEls.forEach((el) => observer.observe(el));
    }
  }

const themeToggle = document.getElementById("themeToggle");
const themeToggleMobile = document.getElementById("themeToggleMobile");

function updateThemeButtons(isDark) {
  const buttons = [
    themeToggle,
    themeToggleMobile
  ].filter(Boolean);

  buttons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      isDark ? "true" : "false"
    );
  });
}

function setTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);

  localStorage.setItem(
    "theme",
    isDark ? "dark" : "light"
  );

  updateThemeButtons(isDark);
}


/* Tema tersimpan */
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  setTheme(true);
} else {
  setTheme(false);
}


/* Tombol desktop */
if (themeToggle) {
  themeToggle.addEventListener("click", () => {

    const isDark =
      !document.body.classList.contains("dark-mode");

    setTheme(isDark);
  });
}


/* Tombol mobile */
if (themeToggleMobile) {
  themeToggleMobile.addEventListener("click", () => {

    const isDark =
      !document.body.classList.contains("dark-mode");

    setTheme(isDark);
  });
}
});
