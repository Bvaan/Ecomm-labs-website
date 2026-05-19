(function () {
  function setCountersToFinal() {
    document.querySelectorAll(".stat-number").forEach((el) => {
      const target = Number(el.dataset.count || "0");
      const suffix = el.dataset.suffix || "";
      el.textContent = `${target}${suffix}`;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!window.gsap) {
      setCountersToFinal();
      return;
    }

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    gsap.from(".hero-line", {
      y: 70,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: "power3.out"
    });

    gsap.from(".hero-copy", {
      y: 24,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: "power3.out"
    });

    if (document.querySelector(".hero-actions .btn")) {
      gsap.from(".hero-actions .btn", {
        scale: 0.8,
        opacity: 0,
        duration: 0.7,
        delay: 0.7,
        stagger: 0.12,
        ease: "back.out(1.6)"
      });
    }

    if (window.ScrollTrigger) {
      gsap.utils.toArray("h2").forEach((heading) => {
        gsap.from(heading, {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: heading,
            start: "top 84%",
            once: true
          }
        });
      });

      if (document.querySelector(".service-list")) {
        gsap.from(".service-card", {
          x: -60,
          opacity: 0,
          duration: 0.85,
          stagger: 0.2,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".service-list",
            start: "top 78%",
            once: true
          }
        });
      }

      gsap.utils.toArray(".stat-number").forEach((el) => {
        const target = Number(el.dataset.count || "0");
        const suffix = el.dataset.suffix || "";
        const counter = { val: 0 };

        gsap.to(counter, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            once: true
          },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.val)}${suffix}`;
          },
          onComplete: () => {
            el.textContent = `${target}${suffix}`;
          }
        });
      });

      if (document.querySelector(".pricing-grid")) {
        gsap.from(".price-card", {
          scale: 0.9,
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.16,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".pricing-grid",
            start: "top 80%",
            once: true
          }
        });
      }

      if (document.querySelector(".project-grid")) {
        gsap.from(".portfolio-card", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.14,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".project-grid",
            start: "top 82%",
            once: true
          }
        });
      }

      gsap.utils.toArray(".reveal").forEach((item) => {
        gsap.from(item, {
          y: 28,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: item,
            start: "top 86%",
            once: true
          }
        });
      });
    } else {
      setCountersToFinal();
    }

    const inquiryForm = document.querySelector(".inquiry-form");
    if (inquiryForm) {
      inquiryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const status = inquiryForm.querySelector(".form-status");
        if (status) {
          status.textContent = "Inquiry received. EComm Labs will respond within 24 hours.";
          status.removeAttribute("hidden");
        }
        inquiryForm.reset();
      });
    }
  });
})();
