// script.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("Main site script loaded");

  // ─────────────── THEME TOGGLE ───────────────
  const desktopToggle = document.getElementById("theme-toggle-desktop");
  const mobileToggle = document.getElementById("theme-toggle-mobile");
  const desktopText = document.getElementById("theme-text-desktop");
  const mobileText = document.getElementById("theme-text-mobile");

  if (desktopToggle && mobileToggle && desktopText && mobileText) {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme === "dark");

    [desktopToggle, mobileToggle].forEach((el) => {
      el.addEventListener("change", () => setTheme(el.checked));
    });

    function setTheme(isDark) {
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      );
      desktopToggle.checked = mobileToggle.checked = isDark;
      desktopText.textContent = mobileText.textContent = isDark
        ? "Light Mode"
        : "Dark Mode";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    }
  }

  // ─────────────── HAMBURGER MENU ───────────────
  const burger = document.getElementById("hamburger-menu");
  const mobilePopup = document.getElementById("hamburger-popup");

  if (burger && mobilePopup) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      mobilePopup.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!mobilePopup.contains(e.target) && !burger.contains(e.target)) {
        burger.classList.remove("active");
        mobilePopup.classList.remove("active");
      }
    });

    mobilePopup.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        burger.classList.remove("active");
        mobilePopup.classList.remove("active");
      });
    });
  }

  // ─────────────── SKILL CARDS ANIMATION ───────────────
  const skillCards = document.querySelectorAll(".skill-percentage");
  if (skillCards.length) {
    const animateSkills = () => {
      skillCards.forEach((card) => {
        const percentage =
          parseInt(card.getAttribute("data-percentage"), 10) || 0;
        const circle = card.querySelector(".circle-progress");
        const text = card.querySelector(".percentage-text");
        if (!circle || !text) return;

        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        let currentPercent = 0;

        const animate = () => {
          if (currentPercent <= percentage) {
            text.textContent = `${currentPercent}%`;
            const offset =
              circumference - (currentPercent / 100) * circumference;
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = offset;
            currentPercent++;
            requestAnimationFrame(animate);
          }
        };

        const obs = new IntersectionObserver(
          (entries, ob) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                animate();
                ob.unobserve(card);
              }
            });
          },
          { threshold: 0.5 }
        );
        obs.observe(card);
      });
    };

    animateSkills();
  }

  // ─────────────── SUBCATEGORY MODAL ───────────────
  const subcategoryModal = document.getElementById("subcategory-modal");
  const subcategoryTitle = document.getElementById("subcategory-title");
  const subcategoryButtonsContainer = document.getElementById(
    "subcategory-buttons"
  );

  function openSubcategoryModal(category, subcategories, names) {
    if (!subcategoryModal || !subcategoryTitle || !subcategoryButtonsContainer)
      return;

    subcategoryTitle.textContent = category || "";

    subcategoryButtonsContainer.innerHTML = "";
    const links = subcategories ? subcategories.split(",") : [];
    const labels = names ? names.split(",") : [];
    links.forEach((link, i) => {
      const btn = document.createElement("button");
      btn.textContent = (labels[i] || `Option ${i + 1}`).trim();
      btn.addEventListener("click", () => {
        if (link.trim()) window.location.href = link.trim();
      });
      subcategoryButtonsContainer.appendChild(btn);
    });

    subcategoryModal.style.display = "flex";
  }

  document.addEventListener("click", (e) => {
    if (subcategoryModal && e.target === subcategoryModal) {
      subcategoryModal.style.display = "none";
    }
  });

  document.querySelectorAll(".view-project-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const item = e.target.closest(".portfolio-item");
      if (!item) return;
      const category = item.getAttribute("data-category") || "";
      const subcategories = item.getAttribute("data-subcategories") || "";
      const names = item.getAttribute("data-names") || "";
      openSubcategoryModal(category, subcategories, names);
    });
  });

  // Close modal buttons (single handler, guarded)
  document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = btn.closest(".modal");
      if (modal) modal.classList.remove("active");
      if (subcategoryModal) subcategoryModal.style.display = "none";
    });
  });

  // ─────────────── SKILLS SECTION OBSERVER ───────────────
  const skillsSection = document.getElementById("skills");
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            skillsSection.classList.add("animate");
            skillsObserver.unobserve(skillsSection);
          }
        });
      },
      { threshold: 0.2 }
    );
    skillsObserver.observe(skillsSection);
  }

  // ─────────────── CANVAS CIRCULAR PROGRESS ───────────────
  const skillsData = [
    { id: "photoshopCanvas", percentage: 90, color: "#31A8FF" },
    { id: "premiereCanvas", percentage: 85, color: "#9999FF" },
    { id: "blenderCanvas", percentage: 80, color: "#F5792A" },
    { id: "afterEffectsCanvas", percentage: 75, color: "#AE81FF" },
    { id: "htmlCssCanvas", percentage: 70, color: "#E44D26" },
    { id: "javascriptCanvas", percentage: 65, color: "#F7DF1E" },
  ];

  function drawCircle(canvasId, percentage, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext("2d");
    // Ensure canvas has proper pixel size
    if (canvas.width === 0 || canvas.height === 0) {
      // fallback: set size if not set
      canvas.width = canvas.clientWidth || 150;
      canvas.height = canvas.clientHeight || 150;
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const lineWidth = 10;
    const startAngle = -Math.PI / 2;

    let currentPercentage = 0;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = "#444";
      ctx.stroke();

      // Progress Circle with Rounded Edges
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        startAngle,
        (Math.PI * 2 * currentPercentage) / 100 - Math.PI / 2
      );
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      ctx.stroke();

      // Percentage Text
      ctx.font = `${Math.max(12, Math.round(radius * 0.35))}px Arial`;
      let cssColor =
        getComputedStyle(document.documentElement).getPropertyValue(
          "--text-color"
        ) || "";
      cssColor = cssColor.trim() || "#fff";
      ctx.fillStyle = cssColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${currentPercentage}%`, centerX, centerY);

      if (currentPercentage < percentage) {
        currentPercentage++;
        requestAnimationFrame(animate);
      }
    }

    animate();
  }

  const canvasObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skill = skillsData.find((s) => s.id === entry.target.id);
          if (skill) {
            drawCircle(skill.id, skill.percentage, skill.color);
            canvasObserver.unobserve(entry.target);
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  skillsData.forEach((skill) => {
    const canvas = document.getElementById(skill.id);
    if (canvas) canvasObserver.observe(canvas);
  });

  // ─────────────── PORTFOLIO FADE-IN & REVEAL ───────────────
  document.querySelectorAll(".portfolio-item").forEach((item) => {
    item.classList.add("fade-in-portfolio");
  });

  function revealOnScroll() {
    const items = document.querySelectorAll(".portfolio-item");
    const trigger = window.innerHeight * 0.92;
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < trigger) {
        item.classList.add("visible");
      }
    });
  }
  // run once and on scroll
  revealOnScroll();
  window.addEventListener("scroll", revealOnScroll);

  // ─────────────── LIGHTBOX / GRAPHICS ───────────────
  const images = document.querySelectorAll(".Graphics-image");
  if (images.length) {
    images.forEach((img) => {
      img.addEventListener("dblclick", (e) => {
        const modal = document.getElementById("lightbox-modal");
        const modalImg = document.getElementById("lightbox-img");
        if (!modal || !modalImg) return;
        modalImg.src = e.currentTarget.src;
        modal.style.display = "flex";
      });
    });

    const closeBtn = document.querySelector(".lightbox-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        const modal = document.getElementById("lightbox-modal");
        if (modal) modal.style.display = "none";
      });
    }

    const modal = document.getElementById("lightbox-modal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    }
  }

  // ─────────────── CONTACT FORM (AJAX) ───────────────
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(this);

      for (let [key, value] of formData.entries()) {
        if (key === "_gotcha") continue;
        if (!value || !String(value).trim()) {
          alert(`Please fill out the ${key} field.`);
          return;
        }
      }

      const recaptchaResponse = formData.get("g-recaptcha-response");
      if (!recaptchaResponse) {
        alert("Please complete the reCAPTCHA.");
        return;
      }

      fetch("https://formspree.io/f/movdovqe", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            window.location.href =
              "https://anubhab521.github.io/Motion-Conflux/thank-you.html";
          } else {
            return response.json().then((data) => {
              if (data.errors) {
                alert(`Error: ${data.errors.map((e) => e.message).join(", ")}`);
              } else {
                alert(
                  "There was an error sending your message. Please try again later."
                );
              }
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(
            "There was an error sending your message. Please try again later."
          );
        });
    });
  }

  // ─────────────── FADE-IN SECTIONS ───────────────
  document.querySelectorAll(".fade-in-section").forEach((section) => {
    const reveal = () => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        section.classList.add("visible");
        window.removeEventListener("scroll", reveal);
      }
    };
    window.addEventListener("scroll", reveal);
    // run once
    reveal();
  });

  // ─────────────── MEDIA OVERLAY LIGHTBOX ───────────────
  document.querySelectorAll(".media-overlay").forEach((overlay) => {
    overlay.addEventListener("dblclick", function () {
      const img = this.previousElementSibling;
      if (img && img.tagName === "IMG") {
        const lightbox = document.getElementById("graphics-lightbox");
        const lightboxImg = document.querySelector(".graphics-lightbox-img");
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = img.src;
        lightbox.style.display = "flex";
      }
    });
  });

  const glClose = document.querySelector(".graphics-lightbox-close");
  if (glClose)
    glClose.onclick = () => {
      const lb = document.getElementById("graphics-lightbox");
      if (lb) lb.style.display = "none";
    };
  const graphicsLightbox = document.getElementById("graphics-lightbox");
  if (graphicsLightbox) {
    graphicsLightbox.onclick = function (e) {
      if (e.target === this) this.style.display = "none";
    };
  }

  // ─────────────── BACK TO TOP BUTTON ───────────────
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 300) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    };
    window.addEventListener("scroll", toggleBackToTop);
    toggleBackToTop();
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ─────────────── TYPEWRITER ───────────────
  const el = document.getElementById("typewriter");
  if (el) {
    const texts = [
      "Multimedia Artist & Developer",
      "Specializing in Graphics, VFX, 3D Animation, Video Editing, and Web Development",
    ];
    let idx = 0,
      char = 0,
      isDeleting = false;
    function type() {
      const current = texts[idx];
      if (!current) return;
      if (isDeleting) {
        char = Math.max(0, char - 1);
        el.textContent = current.substring(0, char);
        if (char === 0) {
          isDeleting = false;
          idx = (idx + 1) % texts.length;
          setTimeout(type, 600);
        } else {
          setTimeout(type, 30);
        }
      } else {
        char = Math.min(current.length, char + 1);
        el.textContent = current.substring(0, char);
        if (char === current.length) {
          isDeleting = true;
          setTimeout(type, 1200);
        } else {
          setTimeout(type, 60);
        }
      }
    }
    type();
  }

  // ------------------------------
  // Disable Right-Click (optional)
  // ------------------------------
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // ------------------------------
  // Disable Screenshot/DevTool Keys (best-effort)
  // ------------------------------
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "PrintScreen" ||
      (e.ctrlKey && e.key === "s") ||
      (e.ctrlKey && e.shiftKey && e.key === "i") ||
      e.key === "F12" ||
      (e.ctrlKey && e.key === "u")
    ) {
      e.preventDefault();
      // avoid repeated modal/alert spam
      try {
        window.alert("Screenshots and copying are disabled on this page.");
      } catch (err) {}
    }
  });

  // ------------------------------
  // Prevent Dragging of Images/Videos
  // ------------------------------
  document.querySelectorAll("img, video").forEach((el) => {
    el.setAttribute("draggable", "false");
  });
  // ------------------------------
  // DevTools blur overlay removed to avoid accidental full-screen blur
  // The previous behavior injected a full-screen element with
  // `backdrop-filter: blur(20px)` which could be triggered falsely.
  // If you want a non-blocking indicator for devtools, implement a
  // console warning or a small unobtrusive UI element instead.
  console.info(
    "DevTools blur overlay disabled to prevent accidental blurring."
  );
});
// ------------------------------
// Disable Right-Click
// ------------------------------
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});
// ------------------------------
// Disable Screenshot/DevTool Keys
// ------------------------------
document.addEventListener("keydown", function (e) {
  if (
    e.key === "PrintScreen" || // PrtSc key
    (e.ctrlKey && e.key === "s") || // Ctrl+S
    (e.ctrlKey && e.shiftKey && e.key === "i") || // Ctrl+Shift+I
    e.key === "F12" || // F12
    (e.ctrlKey && e.key === "u") // Ctrl+U
  ) {
    e.preventDefault();
    alert("Screenshots and copying are disabled on this page.");
  }
});
// ------------------------------
// Prevent Dragging of Images/Videos
// ------------------------------
document.querySelectorAll("img, video").forEach((el) => {
  el.setAttribute("draggable", "false");
});

// DevTools blur overlay removed (duplicate block). Keeping detection disabled
console.info(
  "Removed duplicate DevTools blur overlay to prevent accidental full-screen blur."
);

// Graphics.js

// Wrap all page-specific listeners in DOMContentLoaded to avoid errors
window.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".Graphics-image");
  if (images.length) {
    images.forEach((img) => {
      img.addEventListener("dblclick", (e) => {
        const modal = document.getElementById("lightbox-modal");
        const modalImg = document.getElementById("lightbox-img");

        modalImg.src = e.currentTarget.src;
        modal.style.display = "flex";
      });
    });

    // Close button
    const closeBtn = document.querySelector(".lightbox-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        document.getElementById("lightbox-modal").style.display = "none";
      });
    }

    // Click outside to close
    const modal = document.getElementById("lightbox-modal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault(); // prevent default submit

      const formData = new FormData(this);

      // Basic validation (skip honeypot field)
      for (let [key, value] of formData.entries()) {
        if (key === "_gotcha") continue;
        if (!value.trim()) {
          alert(`Please fill out the ${key} field.`);
          return;
        }
      }

      // Check if reCAPTCHA is completed
      const recaptchaResponse = formData.get("g-recaptcha-response");
      if (!recaptchaResponse) {
        alert("Please complete the reCAPTCHA.");
        return;
      }

      // Submit form via AJAX to Formspree
      fetch("https://formspree.io/f/movdovqe", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            window.location.href =
              "https://anubhab521.github.io/Motion-Conflux/thank-you.html";
          } else {
            return response.json().then((data) => {
              if (data.errors) {
                alert(`Error: ${data.errors.map((e) => e.message).join(", ")}`);
              } else {
                alert(
                  "There was an error sending your message. Please try again later."
                );
              }
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(
            "There was an error sending your message. Please try again later."
          );
        });
    });
  }
});

// Fade-in effect for sections with class 'fade-in-section'
document.querySelectorAll(".fade-in-section").forEach((section) => {
  const reveal = () => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      section.classList.add("visible");
      window.removeEventListener("scroll", reveal);
    }
  };
  window.addEventListener("scroll", reveal);
  window.addEventListener("DOMContentLoaded", reveal);
});

// Media overlay double-click to enlarge image
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".media-overlay").forEach((overlay) => {
    overlay.addEventListener("dblclick", function () {
      const img = this.previousElementSibling;
      if (img && img.tagName === "IMG") {
        const lightbox = document.getElementById("graphics-lightbox");
        const lightboxImg = document.querySelector(".graphics-lightbox-img");
        lightboxImg.src = img.src;
        lightbox.style.display = "flex";
      }
    });
  });

  // Close lightbox
  document.querySelector(".graphics-lightbox-close").onclick = function () {
    document.getElementById("graphics-lightbox").style.display = "none";
  };
  document.getElementById("graphics-lightbox").onclick = function (e) {
    if (e.target === this) this.style.display = "none";
  };
});
