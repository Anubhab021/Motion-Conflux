// script.js

document.addEventListener('DOMContentLoaded', () => {
  console.log('Main site script loaded');

  // ─────────────── Example 1: “Some Button” ───────────────
  // If you have a <button id="some-button"> on any page:
  const someBtn = document.getElementById('some-button');
  if (someBtn) {
    someBtn.addEventListener('click', () => {
      console.log('some-button clicked');
      // …your handler here…
    });
  }

  // ─────────────── Example 2: Portfolio Filter Buttons ───────────────
  // If you have <button class="filter-btn"> elements:
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        console.log('filter button clicked');
        // …your filtering logic here…
      });
    });
  }

  // ─────────────── Example 3: Back-to-Top Link ───────────────
  // If you have <a id="back-to-top">:
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─────────────── Example 4: Page-specific Filter ───────────────
  // If you have an element <div id="page-filter">:
  const pageFilter = document.getElementById('page-filter');
  if (pageFilter) {
    pageFilter.addEventListener('click', () => {
      console.log('page-filter clicked');
      // …your page-filter logic here…
    });
  }

  // ─────────────── Add more guarded listeners below ───────────────
  // For every document.getElementById or querySelector in your old script,
  // change it to this pattern so it never errors out on pages that lack that element.

  // Lightbox for graphics images
  const lightbox = document.getElementById('graphics-lightbox');
  const lightboxImg = document.querySelector('.graphics-lightbox-img');
  const lightboxClose = document.querySelector('.graphics-lightbox-close');
  document.querySelectorAll('.Graphics-image').forEach(img => {
    img.addEventListener('dblclick', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    });
  });
  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      lightboxImg.src = '';
    });
  }
  // Close on outside click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
      }
    });
  }

  // Fade-in animation for cards
  function revealCards() {
    document.querySelectorAll('.Graphics-item').forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        item.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', revealCards);
  revealCards();

  // For each card image overlay, open the lightbox on double click
  document.querySelectorAll('.Graphics-item .media-overlay').forEach(overlay => {
    overlay.addEventListener('dblclick', function () {
      const img = this.previousElementSibling;
      if (img && img.tagName === 'IMG') {
        // Set the lightbox image src
        document.querySelector('#graphics-lightbox .graphics-lightbox').src = img.src;
        document.getElementById('graphics-lightbox').style.display = 'flex';
      }
    });
  });

  // Close lightbox on close button
  document.querySelector('.graphics-lightbox-close').onclick = function () {
    document.getElementById('graphics-lightbox').style.display = 'none';
  };
  // Optional: close on clicking outside the image
  document.getElementById('graphics-lightbox').onclick = function (e) {
    if (e.target === this) this.style.display = 'none';
  };
});


