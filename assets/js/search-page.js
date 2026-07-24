(function () {
  var page = document.getElementById("search-page");
  var form = document.getElementById("search-page-form");
  var input = document.getElementById("search-page-input");
  var typeFilter = document.getElementById("search-filter-type");
  var tagFilter = document.getElementById("search-filter-tag");
  var categoryFilter = document.getElementById("search-filter-category");
  var filterToggle = document.getElementById("search-filter-toggle");
  var filtersPanel = document.getElementById("search-filters");
  var clearButton = document.getElementById("search-clear");
  var resultsNode = document.getElementById("search-results");
  var countNode = document.getElementById("search-count");
  var emptyNode = document.getElementById("search-empty");

  if (!page || !form || !input || !typeFilter || !tagFilter || !categoryFilter || !filterToggle ||
      !filtersPanel || !clearButton || !resultsNode || !countNode || !emptyNode || !window.PapercutSearch) {
    return;
  }

  var entries = [];
  var taxonomyURLs = {
    tags: page.getAttribute("data-tags-url") || "/tags/",
    categories: page.getAttribute("data-categories-url") || "/categories/"
  };

  function addOptions(select, values) {
    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function stateFromControls() {
    return {
      query: input.value.trim(),
      type: typeFilter.value,
      tag: tagFilter.value,
      category: categoryFilter.value
    };
  }

  /* Replaces a native select with a theme-styled listbox; the hidden select stays
     as the source of truth so URL sync and change handling keep working. */
  var dropdowns = [];

  function enhanceSelect(select) {
    var wrapper = document.createElement("div");
    wrapper.className = "search-dropdown";
    select.parentNode.insertBefore(wrapper, select);

    var button = document.createElement("button");
    button.type = "button";
    button.className = "search-dropdown__button";
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");
    var labelledBy = select.getAttribute("aria-labelledby");
    if (labelledBy) {
      button.setAttribute("aria-labelledby", labelledBy);
    }
    var buttonLabel = document.createElement("span");
    button.appendChild(buttonLabel);

    var menu = document.createElement("div");
    menu.className = "search-dropdown__menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;

    wrapper.appendChild(button);
    wrapper.appendChild(select);
    wrapper.appendChild(menu);
    select.hidden = true;
    select.tabIndex = -1;

    function optionItems() {
      return Array.from(menu.children);
    }

    function close() {
      menu.hidden = true;
      button.setAttribute("aria-expanded", "false");
    }

    function open() {
      dropdowns.forEach(function (dropdown) {
        if (dropdown.close !== close) {
          dropdown.close();
        }
      });
      menu.hidden = false;
      button.setAttribute("aria-expanded", "true");
      var selected = optionItems().filter(function (item) {
        return item.getAttribute("data-value") === select.value;
      })[0];
      (selected || menu.firstElementChild).focus();
    }

    function sync() {
      var current = select.options[select.selectedIndex];
      buttonLabel.textContent = current ? current.textContent : "";
      optionItems().forEach(function (item) {
        var isSelected = item.getAttribute("data-value") === select.value;
        item.setAttribute("aria-selected", isSelected ? "true" : "false");
        item.classList.toggle("is-selected", isSelected);
      });
    }

    function rebuild() {
      var items = Array.from(select.options).map(function (option) {
        var item = document.createElement("button");
        item.type = "button";
        item.className = "search-dropdown__option";
        item.setAttribute("role", "option");
        item.setAttribute("data-value", option.value);
        item.textContent = option.textContent;
        item.addEventListener("click", function () {
          select.value = option.value;
          close();
          button.focus();
          select.dispatchEvent(new Event("change", { bubbles: true }));
        });
        return item;
      });
      menu.replaceChildren.apply(menu, items);
      sync();
    }

    button.addEventListener("click", function () {
      if (menu.hidden) {
        open();
      } else {
        close();
      }
    });
    button.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        open();
      }
    });
    menu.addEventListener("keydown", function (event) {
      var items = optionItems();
      var index = items.indexOf(document.activeElement);
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        var next = event.key === "ArrowDown" ? index + 1 : index - 1;
        (items[Math.max(0, Math.min(items.length - 1, next))] || items[0]).focus();
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        items[event.key === "Home" ? 0 : items.length - 1].focus();
      } else if (event.key === "Escape") {
        event.preventDefault();
        close();
        button.focus();
      } else if (event.key === "Tab") {
        close();
      }
    });
    document.addEventListener("click", function (event) {
      if (!wrapper.contains(event.target)) {
        close();
      }
    });

    select.addEventListener("change", sync);
    return { rebuild: rebuild, sync: sync, close: close };
  }

  dropdowns = [typeFilter, tagFilter, categoryFilter].map(enhanceSelect);

  function syncDropdowns() {
    dropdowns.forEach(function (dropdown) {
      dropdown.sync();
    });
  }

  function hasActiveFilters() {
    return !!(typeFilter.value || tagFilter.value || categoryFilter.value);
  }

  function updateFilterToggle() {
    filterToggle.classList.toggle("is-active", hasActiveFilters());
  }

  function setFiltersOpen(open) {
    filtersPanel.hidden = !open;
    filterToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function setSelectValue(select, value) {
    var normalized = window.PapercutSearch.normalize(value);
    var matchingOption = Array.from(select.options).find(function (option) {
      return window.PapercutSearch.normalize(option.value) === normalized;
    });
    select.value = matchingOption ? matchingOption.value : "";
  }

  function applyURL() {
    var params = new URL(window.location.href).searchParams;
    input.value = params.get("q") || "";
    setSelectValue(typeFilter, params.get("type") || "");
    setSelectValue(tagFilter, params.get("tag") || "");
    setSelectValue(categoryFilter, params.get("category") || "");
  }

  function updateURL(state) {
    var url = new URL(window.location.href);
    [
      ["q", state.query],
      ["type", state.type],
      ["tag", state.tag],
      ["category", state.category]
    ].forEach(function (item) {
      if (item[1]) {
        url.searchParams.set(item[0], item[1]);
      } else {
        url.searchParams.delete(item[0]);
      }
    });
    window.history.replaceState({}, "", url.toString());
  }

  function render(shouldUpdateURL) {
    var state = stateFromControls();
    var matches = window.PapercutSearch.search(entries, state);
    var hasCriteria = state.query || state.type || state.tag || state.category;
    var visible = hasCriteria ? matches : matches.slice(0, 12);

    if (shouldUpdateURL) {
      updateURL(state);
    }

    if (!hasCriteria) {
      countNode.textContent = "Showing latest " + visible.length + " entries";
    } else {
      countNode.textContent = matches.length + " matching " + (matches.length === 1 ? "entry" : "entries");
    }

    resultsNode.innerHTML = "";
    emptyNode.classList.toggle("hidden", visible.length !== 0);
    var fragment = document.createDocumentFragment();
    visible.forEach(function (entry) {
      fragment.appendChild(window.PapercutSearch.makeResult(entry, state.query, false, taxonomyURLs));
    });
    resultsNode.appendChild(fragment);
  }

  function handleChange() {
    updateFilterToggle();
    render(true);
  }

  filterToggle.addEventListener("click", function () {
    setFiltersOpen(filtersPanel.hidden);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    render(true);
  });
  input.addEventListener("input", handleChange);
  typeFilter.addEventListener("change", handleChange);
  tagFilter.addEventListener("change", handleChange);
  categoryFilter.addEventListener("change", handleChange);
  clearButton.addEventListener("click", function () {
    input.value = "";
    typeFilter.value = "";
    tagFilter.value = "";
    categoryFilter.value = "";
    syncDropdowns();
    updateFilterToggle();
    input.focus();
    render(true);
  });
  window.addEventListener("popstate", function () {
    applyURL();
    syncDropdowns();
    updateFilterToggle();
    if (hasActiveFilters()) {
      setFiltersOpen(true);
    }
    render(false);
  });

  window.PapercutSearch.load(page.getAttribute("data-search-index-url"))
    .then(function (loadedEntries) {
      entries = loadedEntries;
      addOptions(typeFilter, window.PapercutSearch.collectOptions(entries, "section"));
      addOptions(tagFilter, window.PapercutSearch.collectOptions(entries, "tags"));
      addOptions(categoryFilter, window.PapercutSearch.collectOptions(entries, "categories"));
      dropdowns.forEach(function (dropdown) {
        dropdown.rebuild();
      });
      applyURL();
      syncDropdowns();
      updateFilterToggle();
      if (hasActiveFilters()) {
        setFiltersOpen(true);
      }
      render(false);
    })
    .catch(function () {
      countNode.textContent = "Search is temporarily unavailable.";
      emptyNode.classList.remove("hidden");
    });
})();
