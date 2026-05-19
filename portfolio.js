(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const filters = document.querySelectorAll(".filter-pill");
    const cards = document.querySelectorAll(".portfolio-card");

    filters.forEach((filter) => {
      filter.addEventListener("click", () => {
        const category = filter.dataset.filter || "all";

        filters.forEach((item) => item.classList.remove("is-active"));
        filter.classList.add("is-active");

        cards.forEach((card) => {
          const shouldShow = category === "all" || card.dataset.category === category;
          card.classList.toggle("is-hidden", !shouldShow);

          if (shouldShow && window.gsap) {
            gsap.fromTo(
              card,
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.36, ease: "power2.out", overwrite: true }
            );
          }
        });

        if (window.ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      });
    });
  });
})();
