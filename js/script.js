// script.js

document.addEventListener('DOMContentLoaded', () => {
  console.log('Main site script loaded');

  // ─────────────── THEME TOGGLE ───────────────
  const desktopToggle = document.getElementById('theme-toggle-desktop');
  const mobileToggle  = document.getElementById('theme-toggle-mobile');
  const desktopText   = document.getElementById('theme-text-desktop');
  const mobileText    = document.getElementById('theme-text-mobile');

  if (desktopToggle && mobileToggle && desktopText && mobileText) {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme === 'dark');

    [desktopToggle, mobileToggle].forEach((el) => {
      el.addEventListener('change', () => setTheme(el.checked));
    });

    function setTheme(isDark) {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      desktopToggle.checked = mobileToggle.checked = isDark;
      desktopText.textContent = mobileText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }

  // ─────────────── HAMBURGER MENU ───────────────
  const burger      = document.getElementById('hamburger-menu');
  const mobilePopup = document.getElementById('hamburger-popup');

  if (burger && mobilePopup) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      mobilePopup.classList.toggle('active');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobilePopup.contains(e.target) && !burger.contains(e.target)) {
        burger.classList.remove('active');
        mobilePopup.classList.remove('active');
      }
    });

    // Close when any popup link is clicked
    mobilePopup.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        mobilePopup.classList.remove('active');
      });
    });
  }

  // ─────────────── SKILL CARDS ANIMATION ───────────────
  const skillCards = document.querySelectorAll('.skill-percentage');
  if (skillCards.length) {
    const animateSkills = () => {
      skillCards.forEach((card) => {
        const percentage = parseInt(card.getAttribute('data-percentage'), 10);
        const circle     = card.querySelector('.circle-progress');
        const text       = card.querySelector('.percentage-text');
        if (!circle || !text) return;

        const radius        = 45;
        const circumference = 2 * Math.PI * radius;
        let currentPercent  = 0;

        const animate = () => {
          if (currentPercent <= percentage) {
            text.textContent = `${currentPercent}%`;
            const offset = circumference - (currentPercent / 100) * circumference;
            circle.style.strokeDasharray  = circumference;
            circle.style.strokeDashoffset = offset;
            currentPercent++;
            requestAnimationFrame(animate);
          }
        };

        const observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                animate();
                obs.unobserve(card);
              }
            });
          },
          { threshold: 0.5 }
        );
        observer.observe(card);
      });
    };

    animateSkills();
  }

  // ─────────────── SUBCATEGORY MODAL ───────────────
  const subcategoryModal           = document.getElementById('subcategory-modal');
  const subcategoryTitle           = document.getElementById('subcategory-title');
  const subcategoryButtonsContainer = document.getElementById('subcategory-buttons');
  const modalClose                 = document.querySelector('.modal-close');

  function openSubcategoryModal(category, subcategories, names) {
    if (!subcategoryModal || !subcategoryTitle || !subcategoryButtonsContainer) return;

    // Set title
    subcategoryTitle.textContent = category;

    // Build buttons
    subcategoryButtonsContainer.innerHTML = '';
    const links = subcategories.split(',');
    const labels = names.split(',');
    links.forEach((link, i) => {
      const btn = document.createElement('button');
      btn.textContent = labels[i] || `Option ${i+1}`;
      btn.addEventListener('click', () => {
        window.location.href = link;
      });
      subcategoryButtonsContainer.appendChild(btn);
    });

    subcategoryModal.style.display = 'flex';
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      subcategoryModal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (subcategoryModal && e.target === subcategoryModal) {
      subcategoryModal.style.display = 'none';
    }
  });

  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = e.target.closest('.portfolio-item');
      if (!item) return;
      const category     = item.getAttribute('data-category');
      const subcategories = item.getAttribute('data-subcategories') || '';
      const names         = item.getAttribute('data-names') || '';
      openSubcategoryModal(category, subcategories, names);
    });
  });

  // ─────────────── ANIMATE SKILLS SECTION ───────────────
  const skillsSection = document.getElementById("skills");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          skillsSection.classList.add("animate");
        }
      });
    },
    { threshold: 0.2 } // Trigger when 20% of the section is visible
  );

  observer.observe(skillsSection);

  // Animate Circular Progress Bars Using Canvas
  // To add more skill graphs, just add more objects to this array.
  // Example: { id: "newSkillCanvas", percentage: 60, color: "#FF0000" }
  const skillsData = [
    { id: "photoshopCanvas", percentage: 90, color: "#31A8FF" },
    { id: "premiereCanvas", percentage: 85, color: "#9999FF" },
    { id: "blenderCanvas", percentage: 80, color: "#F5792A" },
    { id: "afterEffectsCanvas", percentage: 75, color: "#AE81FF" },
    { id: "htmlCssCanvas", percentage: 70, color: "#E44D26" },
    { id: "javascriptCanvas", percentage: 65, color: "#F7DF1E" },
    // { id: "newSkillCanvas", percentage: 60, color: "#FF0000" }, // Example
  ];

  function drawCircle(canvasId, percentage, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 60;
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
      ctx.font = "16px Arial";
      // Use CSS variable for text color for both themes
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || "#fff";
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
          const skill = skillsData.find(
            (skill) => skill.id === entry.target.id
          );
          if (skill) {
            drawCircle(skill.id, skill.percentage, skill.color);
          }
        }
      });
    },
    { threshold: 0.5 } // Trigger when 50% of the section is visible
  );

  skillsData.forEach((skill) => {
    const canvas = document.getElementById(skill.id);
    if (canvas) canvasObserver.observe(canvas);
  });

  // ─────────────── EXAMPLE / GUARD PATTERN (retain for reference) ───────────────
  // const someBtn = document.getElementById('some-button');
  // if (someBtn) {
  //   someBtn.addEventListener('click', () => { /* … */ });
  // }
  // …and likewise for any future `getElementById` or `querySelector` calls.
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
  
  // ------------------------------
  // 10. Blur Screen if Dev Tools is Open
  // ------------------------------
  const blurDiv = document.createElement("div");
  blurDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(20px);
    z-index: 9999;
    display: none;
  `;
  document.body.appendChild(blurDiv);

  function detectDevTools() {
    const widthThreshold = window.outerWidth - window.innerWidth > 100;
    const heightThreshold = window.outerHeight - window.innerHeight > 100;
    if (widthThreshold || heightThreshold) {
      blurDiv.style.display = "block";
    } else {
      blurDiv.style.display = "none";
    }
  }

  setInterval(detectDevTools, 1000);

  // Graphics.js

// Wrap all page-specific listeners in DOMContentLoaded to avoid errors
window.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.Graphics-image');
  if (images.length) {
    images.forEach(img => {
      img.addEventListener('dblclick', e => {
        const modal = document.getElementById('lightbox-modal');
        const modalImg = document.getElementById('lightbox-img');

        modalImg.src = e.currentTarget.src;
        modal.style.display = 'flex';
      });
    });

    // Close button
    const closeBtn = document.querySelector('.lightbox-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('lightbox-modal').style.display = 'none';
      });
    }

    // Click outside to close
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    }
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault(); // prevent default submit

      const formData = new FormData(this);

      // Basic validation (skip honeypot field)
      for (let [key, value] of formData.entries()) {
        if (key === '_gotcha') continue;
        if (!value.trim()) {
          alert(`Please fill out the ${key} field.`);
          return;
        }
      }

      // Check if reCAPTCHA is completed
      const recaptchaResponse = formData.get('g-recaptcha-response');
      if (!recaptchaResponse) {
        alert('Please complete the reCAPTCHA.');
        return;
      }

      // Submit form via AJAX to Formspree
      fetch('https://formspree.io/f/movdovqe', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          window.location.href = 'https://anubhab521.github.io/Motion-Conflux/thank-you.html';
        } else {
          return response.json().then(data => {
            if (data.errors) {
              alert(`Error: ${data.errors.map(e => e.message).join(', ')}`);
            } else {
              alert('There was an error sending your message. Please try again later.');
            }
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('There was an error sending your message. Please try again later.');
      });
    });
  }
});




