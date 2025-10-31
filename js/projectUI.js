// Import the search engine
import ProjectSearch from "./projectSearch.js";

// Initialize search engine and UI
document.addEventListener("DOMContentLoaded", async () => {
  const searchEngine = new ProjectSearch();
  const initialized = await searchEngine.initialize();

  if (!initialized) {
    console.error("Failed to initialize project search");
    return;
  }

  // Cache DOM elements
  const searchInput = document.getElementById("project-search");
  const categorySelect = document.getElementById("category-filter");
  const tagContainer = document.getElementById("tag-filters");
  const projectsGrid = document.getElementById("projects-grid");
  const yearFilter = document.getElementById("year-filter");

  // Update UI with search results
  function updateResults(results) {
    if (!projectsGrid) return;

    projectsGrid.innerHTML = "";

    if (results.length === 0) {
      projectsGrid.innerHTML = `
        <div class="no-results">
          <h3>No projects found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      `;
      return;
    }

    results.forEach((project) => {
      const card = createProjectCard(project);
      projectsGrid.appendChild(card);
    });
  }

  // Create project card element
  function createProjectCard(project) {
    const card = document.createElement("article");
    card.className = "project-card";
    card.innerHTML = `
      <div class="project-thumbnail">
        <img src="${project.thumbnail}" alt="${project.title}" loading="lazy">
      </div>
      <div class="project-info">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">
          ${project.tags
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("")}
        </div>
        <div class="project-meta">
          <span class="year">${project.year}</span>
          <span class="category">${project.category}</span>
        </div>
      </div>
    `;

    // Add click handler to open project detail
    card.addEventListener("click", () => {
      openProjectDetail(project);
    });

    return card;
  }

  // Handle search input
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const results = searchEngine.setFilter("searchTerm", e.target.value);
      updateResults(results);
    });
  }

  // Handle category selection
  if (categorySelect) {
    categorySelect.addEventListener("change", (e) => {
      const results = searchEngine.setFilter("category", e.target.value);
      updateResults(results);
    });
  }

  // Handle year selection
  if (yearFilter) {
    yearFilter.addEventListener("change", (e) => {
      const results = searchEngine.setFilter("year", parseInt(e.target.value));
      updateResults(results);
    });
  }

  // Initialize with all projects
  updateResults(searchEngine.search());
});

// Function to open project detail view
function openProjectDetail(project) {
  // Create modal or navigate to project detail page
  const modal = document.createElement("div");
  modal.className = "project-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      <div class="project-media">
        ${getMediaHTML(project.media)}
      </div>
      <div class="project-details">
        <h2>${project.title}</h2>
        <p class="project-description">${project.description}</p>
        <div class="project-metadata">
          <p><strong>Category:</strong> ${project.category}</p>
          <p><strong>Year:</strong> ${project.year}</p>
          <p><strong>Tools:</strong> ${project.tools.join(", ")}</p>
        </div>
        <div class="project-tags">
          ${project.tags
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("")}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Handle close button
  const closeBtn = modal.querySelector(".close-modal");
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  // Close on click outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Helper function to generate media HTML
function getMediaHTML(media) {
  const mainExt = media.main.split(".").pop().toLowerCase();

  if (["mp4", "webm"].includes(mainExt)) {
    return `
      <video controls>
        <source src="${media.main}" type="video/${mainExt}">
        Your browser does not support the video tag.
      </video>
    `;
  }

  return `<img src="${media.main}" alt="Project media">`;
}
