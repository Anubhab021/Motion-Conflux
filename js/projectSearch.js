// ProjectSearch class handles all search and filtering functionality
class ProjectSearch {
  constructor() {
    this.projects = [];
    this.categories = {};
    this.filters = {
      category: null,
      subcategory: null,
      tags: [],
      year: null,
      searchTerm: "",
    };
  }

  // Initialize with data from projects.json
  async initialize() {
    try {
      const response = await fetch("/data/projects.json");
      const data = await response.json();
      this.projects = data.projects;
      this.categories = data.categories;
      return true;
    } catch (error) {
      console.error("Failed to load projects:", error);
      return false;
    }
  }

  // Search projects based on current filters
  search() {
    return this.projects.filter((project) => {
      // Apply category filter
      if (this.filters.category && project.category !== this.filters.category) {
        return false;
      }

      // Apply subcategory filter
      if (
        this.filters.subcategory &&
        project.subcategory !== this.filters.subcategory
      ) {
        return false;
      }

      // Apply tags filter
      if (this.filters.tags.length > 0) {
        const hasAllTags = this.filters.tags.every((tag) =>
          project.tags.includes(tag)
        );
        if (!hasAllTags) return false;
      }

      // Apply year filter
      if (this.filters.year && project.year !== this.filters.year) {
        return false;
      }

      // Apply search term
      if (this.filters.searchTerm) {
        const searchTermLower = this.filters.searchTerm.toLowerCase();
        const searchFields = [
          project.title,
          project.description,
          ...project.tags,
          project.category,
          project.subcategory,
        ].map((field) => (field || "").toLowerCase());

        return searchFields.some((field) => field.includes(searchTermLower));
      }

      return true;
    });
  }

  // Set filters
  setFilter(type, value) {
    this.filters[type] = value;
    return this.search();
  }

  // Clear all filters
  clearFilters() {
    this.filters = {
      category: null,
      subcategory: null,
      tags: [],
      year: null,
      searchTerm: "",
    };
    return this.search();
  }

  // Get available tags from filtered results
  getAvailableTags() {
    const results = this.search();
    const tagSet = new Set();
    results.forEach((project) => {
      project.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }

  // Get years from filtered results
  getAvailableYears() {
    const results = this.search();
    const yearSet = new Set();
    results.forEach((project) => yearSet.add(project.year));
    return Array.from(yearSet).sort((a, b) => b - a);
  }
}

// Export the class
export default ProjectSearch;
