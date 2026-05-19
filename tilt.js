(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (prefersReducedMotion || !canHover) return;

  const cards = document.querySelectorAll("[data-tilt-card]");
  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 13;
      const rotateX = (0.5 - y) * 10;
      card.style.setProperty("--tilt-x", `${x * 100}%`);
      card.style.setProperty("--tilt-y", `${y * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) translateZ(18px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("transform");
      card.style.setProperty("--tilt-x", "50%");
      card.style.setProperty("--tilt-y", "50%");
    });
  });
})();
