(function () {
  const nav = document.querySelector(".site-nav");
  const brand = document.querySelector(".brand-link");
  const toggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-menu a");

  function setMenuState(open) {
    if (!toggle || !mobileMenu) return;
    toggle.classList.toggle("is-open", open);
    mobileMenu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    mobileMenu.setAttribute("aria-hidden", String(!open));
  }

  function updateScrolledState() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.remove("preload");
    updateScrolledState();

    if (toggle) {
      toggle.addEventListener("click", () => {
        setMenuState(!toggle.classList.contains("is-open"));
      });
    }

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuState(false);
    });

    window.addEventListener("scroll", updateScrolledState, { passive: true });

    if (window.gsap && window.ScrollTrigger && nav) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(nav, {
        height: 56,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top -80",
          end: "top -240",
          scrub: true
        }
      });

      if (brand) {
        gsap.to(brand, {
          scale: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top -80",
            end: "top -240",
            scrub: true
          }
        });
      }
    }
  });
})();
