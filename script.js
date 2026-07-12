document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const header = document.querySelector(".site-header");
  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    header.querySelectorAll(".main-nav a").forEach((link) => {
      link.addEventListener("click", () => header.classList.remove("nav-open"));
    });
  }

  // Optional homepage filter (purely presentational demo filter)
  const filterButtons = document.querySelectorAll(".filter-row button");
  const cards = document.querySelectorAll(".project-card");
  if (filterButtons.length && cards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;
        cards.forEach((card) => {
          const show = filter === "all" || card.dataset.category === filter;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  // Contact form -> Formspree (AJAX submit, no page redirect)
  const contactForm = document.querySelector(".contact-form");
  const statusEl = document.getElementById("form-status");
  if (contactForm && statusEl) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector("button[type='submit']");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      statusEl.textContent = "";
      statusEl.className = "form-status";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          contactForm.reset();
          statusEl.textContent = "Thanks — your message is on its way. I'll get back to you soon.";
          statusEl.className = "form-status success";
        } else {
          const data = await response.json().catch(() => ({}));
          const detail = data.errors ? data.errors.map((err) => err.message).join(", ") : "";
          statusEl.textContent = detail || "Something went wrong. Please email me directly instead.";
          statusEl.className = "form-status error";
        }
      } catch (err) {
        statusEl.textContent = "Something went wrong. Please email me directly instead.";
        statusEl.className = "form-status error";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send message";
      }
    });
  }
});
