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

  // Fade-in animation for video cards
  function revealCards() {
    document.querySelectorAll('.Video_animation-item').forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        item.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', revealCards);
  revealCards();
});
