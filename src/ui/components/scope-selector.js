// =============================================================================
// 🔍 SCOPE SELECTOR COMPONENT - Searchable Multi-Select OAuth Scopes
// =============================================================================

import { PLATFORM_SCOPES, searchScopes } from '../shared/scopes.js';

export function createScopeSelector(containerId, initialPlatform = '', initialScopes = []) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Scope selector container not found:', containerId);
    return;
  }

  let currentPlatform = initialPlatform;
  let selectedScopes = new Set(initialScopes);
  let isOpen = false;

  // Create the scope selector HTML
  function render() {
    const platformData = PLATFORM_SCOPES[currentPlatform];
    const hasScopes = platformData && Object.keys(platformData.categories).length > 0;
    
    container.innerHTML = `
      <div class="scope-selector">
        <div class="scope-input-container">
          <div class="scope-display" onclick="toggleDropdown()" id="scopeDisplay">
            ${selectedScopes.size > 0 
              ? `<div class="selected-scopes-preview">
                  ${Array.from(selectedScopes).slice(0, 3).map(scope => 
                    `<span class="scope-tag">${scope}</span>`
                  ).join('')}
                  ${selectedScopes.size > 3 ? `<span class="scope-count">+${selectedScopes.size - 3} more</span>` : ''}
                 </div>`
              : `<span class="scope-placeholder">${hasScopes ? 'Click to select scopes...' : 'Select a platform first'}</span>`
            }
            <span class="dropdown-arrow ${isOpen ? 'open' : ''}">▼</span>
          </div>
        </div>
        
        <div class="scope-dropdown ${isOpen ? 'open' : ''}" id="scopeDropdown">
          ${hasScopes ? renderScopeDropdown() : '<div class="no-scopes">Select a platform first to see available scopes</div>'}
        </div>
      </div>
      
      <style>
        .scope-selector {
          position: relative;
          width: 100%;
        }
        
        .scope-input-container {
          position: relative;
        }
        
        .scope-display {
          min-height: 45px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: var(--space-2) var(--space-3);
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: border-color 0.2s ease;
        }
        
        .scope-display:hover {
          border-color: var(--primary-300);
        }
        
        .scope-display.open {
          border-color: var(--primary-500);
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
        
        .selected-scopes-preview {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-1);
          flex: 1;
        }
        
        .scope-tag {
          background: var(--primary-100);
          color: var(--primary-700);
          padding: 2px var(--space-2);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .scope-count {
          background: var(--gray-100);
          color: var(--gray-600);
          padding: 2px var(--space-2);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
        }
        
        .scope-placeholder {
          color: var(--gray-500);
          font-style: italic;
        }
        
        .dropdown-arrow {
          color: var(--gray-400);
          font-size: 0.8rem;
          transition: transform 0.2s ease;
          margin-left: var(--space-2);
        }
        
        .dropdown-arrow.open {
          transform: rotate(180deg);
        }
        
        .scope-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid var(--border-color);
          border-top: none;
          border-radius: 0 0 var(--radius-md) var(--radius-md);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
          display: none;
        }
        
        .scope-dropdown.open {
          display: block;
        }
        
        .scope-search {
          padding: var(--space-3);
          border-bottom: 1px solid var(--border-color);
        }
        
        .scope-search input {
          width: 100%;
          padding: var(--space-2);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
        }
        
        .scope-category {
          border-bottom: 1px solid var(--gray-100);
        }
        
        .scope-category:last-child {
          border-bottom: none;
        }
        
        .scope-category-header {
          padding: var(--space-3);
          background: var(--gray-50);
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--gray-700);
          border-bottom: 1px solid var(--gray-200);
        }
        
        .scope-option {
          padding: var(--space-2) var(--space-3);
          cursor: pointer;
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          transition: background-color 0.15s ease;
        }
        
        .scope-option:hover {
          background: var(--gray-50);
        }
        
        .scope-checkbox {
          margin-top: 2px;
          cursor: pointer;
        }
        
        .scope-info {
          flex: 1;
        }
        
        .scope-name {
          font-weight: 500;
          font-size: 0.875rem;
          color: var(--gray-800);
          font-family: var(--font-mono);
        }
        
        .scope-description {
          font-size: 0.75rem;
          color: var(--gray-600);
          margin-top: 2px;
        }
        
        .no-scopes {
          padding: var(--space-8);
          text-align: center;
          color: var(--gray-500);
        }
        
        .scope-summary {
          padding: var(--space-3);
          background: var(--primary-50);
          border-bottom: 1px solid var(--primary-200);
          font-size: 0.875rem;
          color: var(--primary-700);
        }
      </style>
    `;

    // Attach event listeners after rendering
    attachEventListeners();
  }

  function renderScopeDropdown() {
    const platformData = PLATFORM_SCOPES[currentPlatform];
    if (!platformData) return '<div class="no-scopes">No scopes available for this platform</div>';

    return `
      <div class="scope-summary">
        ${selectedScopes.size} scope${selectedScopes.size !== 1 ? 's' : ''} selected
      </div>
      
      <div class="scope-search">
        <input type="text" placeholder="Search scopes..." id="scopeSearchInput" oninput="handleSearch(event)">
      </div>
      
      <div id="scopeCategories">
        ${renderScopeCategories('')}
      </div>
    `;
  }

  function renderScopeCategories(searchQuery = '') {
    const platformData = PLATFORM_SCOPES[currentPlatform];
    if (!platformData) return '';

    if (searchQuery) {
      // Show search results
      const searchResults = searchScopes(currentPlatform, searchQuery);
      if (searchResults.length === 0) {
        return '<div class="no-scopes">No scopes match your search</div>';
      }

      return `
        <div class="scope-category">
          <div class="scope-category-header">Search Results (${searchResults.length})</div>
          ${searchResults.map(scope => renderScopeOption(scope)).join('')}
        </div>
      `;
    }

    // Show all categories
    return Object.entries(platformData.categories).map(([categoryName, scopes]) => `
      <div class="scope-category">
        <div class="scope-category-header">${categoryName} (${scopes.length})</div>
        ${scopes.map(scope => renderScopeOption(scope)).join('')}
      </div>
    `).join('');
  }

  function renderScopeOption(scope) {
    const isSelected = selectedScopes.has(scope.scope);
    return `
      <div class="scope-option" onclick="toggleScope('${scope.scope.replace(/'/g, "\\'")}')">
        <input type="checkbox" class="scope-checkbox" ${isSelected ? 'checked' : ''}>
        <div class="scope-info">
          <div class="scope-name">${scope.scope}</div>
          <div class="scope-description">${scope.description}</div>
        </div>
      </div>
    `;
  }

  function attachEventListeners() {
    // Make functions globally accessible for inline event handlers
    window.toggleDropdown = toggleDropdown;
    window.toggleScope = toggleScope;
    window.handleSearch = handleSearch;

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
      if (!container.contains(event.target)) {
        closeDropdown();
      }
    });
  }

  function toggleDropdown() {
    if (!PLATFORM_SCOPES[currentPlatform]) return;
    
    isOpen = !isOpen;
    render();
  }

  function closeDropdown() {
    if (isOpen) {
      isOpen = false;
      render();
    }
  }

  function toggleScope(scopeName) {
    if (selectedScopes.has(scopeName)) {
      selectedScopes.delete(scopeName);
    } else {
      selectedScopes.add(scopeName);
    }
    render();
  }

  function handleSearch(event) {
    const query = event.target.value;
    const categoriesContainer = document.getElementById('scopeCategories');
    if (categoriesContainer) {
      categoriesContainer.innerHTML = renderScopeCategories(query);
    }
  }

  // Public API
  const scopeSelector = {
    setPlatform(platform) {
      currentPlatform = platform;
      selectedScopes.clear();
      render();
    },

    setScopes(scopes) {
      selectedScopes = new Set(scopes);
      render();
    },

    getSelectedScopes() {
      return Array.from(selectedScopes);
    },

    render() {
      render();
    }
  };

  // Initial render
  render();

  return scopeSelector;
}