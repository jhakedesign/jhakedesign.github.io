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

  // Case-study gallery lightbox
  const galleryButtons = document.querySelectorAll(".cs-gallery button");
  if (galleryButtons.length) {
    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay hidden";
    overlay.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close image">&times;</button><img alt="">';
    document.body.appendChild(overlay);
    const overlayImg = overlay.querySelector("img");
    const closeBtn = overlay.querySelector(".lightbox-close");

    function openLightbox(src, alt) {
      overlayImg.src = src;
      overlayImg.alt = alt || "";
      overlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }
    function closeLightbox() {
      overlay.classList.add("hidden");
      overlayImg.src = "";
      document.body.style.overflow = "";
    }

    galleryButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const img = btn.querySelector("img");
        openLightbox(btn.dataset.full || img.src, img.alt);
      });
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target === closeBtn) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.classList.contains("hidden")) closeLightbox();
    });
  }
});
