document.addEventListener("DOMContentLoaded", () => {

  if (window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {

      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const hoverElements = document.querySelectorAll('a, button, .portfolio-card__thumb img, .theme-switch');

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });
  }

  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navMenu.setAttribute("aria-hidden", String(!isOpen));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.setAttribute("aria-hidden", "true");
      });
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".navbar")) {
        navMenu.classList.remove("is-open");
        navToggle.classList.remove("is-open");
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
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");

              setTimeout(() => {
                entry.target.style.maxHeight = "none";
                entry.target.style.overflow = "visible";
              }, 800);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
      );
      revealEls.forEach((el) => {
        el.style.transitionDelay = `${Math.random() * 0.15}s`;
        observer.observe(el);
      });
    }
  }

  const themeToggle = document.getElementById("themeToggle");
  const themeToggleMobile = document.getElementById("themeToggleMobile");

  function updateThemeButtons(isDark) {
    [themeToggle, themeToggleMobile].filter(Boolean).forEach((button) => {
      button.setAttribute("aria-pressed", isDark ? "true" : "false");
    });
  }

  function setTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeButtons(isDark);
  }

  const savedTheme = localStorage.getItem("theme");
  setTheme(savedTheme === "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTheme(!document.body.classList.contains("dark-mode"));
    });
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener("click", () => {
      setTheme(!document.body.classList.contains("dark-mode"));
    });
  }
});

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const closeModal = document.getElementById("modalClose");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");

let currentGallery = [];
let currentIndex = 0;

if (modal && modalImg && closeModal) {
  const galleryImages = document.querySelectorAll(".portfolio-card__thumb img, .achievement-image img");

  galleryImages.forEach((img) => {
    img.addEventListener("click", function () {
      modal.classList.add("is-open");
      const dataImages = this.getAttribute("data-images");
      currentGallery = dataImages ? dataImages.split(",").map(i => i.trim()) : [this.src];
      currentIndex = 0;
      updateModalImage();
    });
  });

  function updateModalImage() {
    modalImg.src = currentGallery[currentIndex];
    if (currentGallery.length > 1) {
      if (modalPrev) modalPrev.classList.remove("is-hidden");
      if (modalNext) modalNext.classList.remove("is-hidden");
    } else {
      if (modalPrev) modalPrev.classList.add("is-hidden");
      if (modalNext) modalNext.classList.add("is-hidden");
    }
  }

  if (modalNext) {
    modalNext.addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % currentGallery.length;
      updateModalImage();
    });
  }

  if (modalPrev) {
    modalPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
      updateModalImage();
    });
  }

  closeModal.addEventListener("click", () => modal.classList.remove("is-open"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("is-open");
  });

  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("is-open")) {
      if (e.key === "Escape") modal.classList.remove("is-open");
      else if (e.key === "ArrowRight" && currentGallery.length > 1) {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        updateModalImage();
      } else if (e.key === "ArrowLeft" && currentGallery.length > 1) {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateModalImage();
      }
    }
  });
}

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  const progressBar = document.getElementById("preloaderProgress");
  const percentageText = document.getElementById("preloaderPercentage");

  if (preloader && progressBar && percentageText) {
    const hasSeenPreloader = sessionStorage.getItem("hasSeenPreloader");
    const isReload = performance.getEntriesByType("navigation")[0]?.type === "reload";

    if (hasSeenPreloader === "true" && !isReload) {
      preloader.style.display = "none";
    } else {
      let progress = 0;
      const loadingInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 2; 
        if (progress >= 100) {
          progress = 100;
          clearInterval(loadingInterval);
          setTimeout(() => {
            preloader.classList.add("is-hidden");
            sessionStorage.setItem("hasSeenPreloader", "true");
          }, 400);
        }
        progressBar.style.width = progress + "%";
        percentageText.innerText = progress + "%";
      }, 30); 
    }
  }
});