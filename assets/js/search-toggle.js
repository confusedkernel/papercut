(function () {
  var components = document.querySelectorAll("[data-search-component]");
  if (!components.length || !window.PapercutSearch) {
    return;
  }

  components.forEach(function (component) {
    var form = component.querySelector("[data-search-form]");
    var button = component.querySelector("[data-search-button]");
    var input = component.querySelector("[data-search-input]");
    var panel = component.querySelector("[data-search-popover]");
    var resultsNode = component.querySelector("[data-search-results]");
    var statusNode = component.querySelector("[data-search-status]");
    var emptyNode = component.querySelector("[data-search-empty]");
    var footerNode = component.querySelector("[data-search-footer]");
    var viewAll = component.querySelector("[data-search-view-all]");
    if (!form || !input || !panel || !resultsNode || !statusNode || !emptyNode || !footerNode || !viewAll) {
      return;
    }

    var entries = null;
    var indexRequested = false;
    var searchURL = viewAll.href;

    function updateViewAll(query) {
      var url = new URL(searchURL, window.location.href);
      if (query) {
        url.searchParams.set("q", query);
      } else {
        url.searchParams.delete("q");
      }
      viewAll.href = url.toString();
    }

    function render() {
      var query = input.value.trim();
      updateViewAll(query);
      if (!query) {
        resultsNode.replaceChildren();
        statusNode.hidden = false;
        resultsNode.hidden = false;
        footerNode.hidden = false;
        emptyNode.hidden = true;
        return;
      }
      if (!entries) {
        return;
      }

      var matches = window.PapercutSearch.search(entries, { query: query });
      var visible = matches.slice(0, 6);
      var hasResults = visible.length !== 0;
      panel.classList.toggle("is-empty", !hasResults);
      statusNode.hidden = !hasResults;
      resultsNode.hidden = !hasResults;
      footerNode.hidden = !hasResults;
      emptyNode.hidden = hasResults;

      statusNode.textContent = matches.length + " result" + (matches.length === 1 ? "" : "s") + " for \"" + query + "\"";

      var fragment = document.createDocumentFragment();
      visible.forEach(function (entry) {
        fragment.appendChild(window.PapercutSearch.makeResult(entry, query, true));
      });
      resultsNode.replaceChildren(fragment);
    }

    function loadIndex() {
      if (entries || indexRequested) {
        return;
      }
      indexRequested = true;
      statusNode.textContent = "Loading search index...";
      window.PapercutSearch.load(component.getAttribute("data-search-index-url"))
        .then(function (loadedEntries) {
          entries = loadedEntries;
          open();
        })
        .catch(function () {
          statusNode.textContent = "Search is temporarily unavailable.";
          emptyNode.hidden = false;
        });
    }

    function open() {
      var hasQuery = input.value.trim() !== "";
      var canShowResults = hasQuery && entries !== null;
      component.classList.add("is-open");
      panel.hidden = !canShowResults;
      if (button) {
        button.setAttribute("aria-expanded", canShowResults ? "true" : "false");
        button.setAttribute("aria-label", "Search");
      }
      if (!hasQuery) {
        return;
      }
      if (!entries) {
        panel.classList.remove("is-empty");
        statusNode.hidden = false;
        resultsNode.hidden = false;
        footerNode.hidden = false;
        emptyNode.hidden = true;
        loadIndex();
        return;
      }
      render();
    }

    function close(clear) {
      if (clear) {
        input.value = "";
        updateViewAll("");
      }
      panel.hidden = true;
      if (!input.value.trim()) {
        component.classList.remove("is-open");
      }
      if (button) {
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Open search");
      }
    }

    if (button) {
      button.addEventListener("click", function () {
        open();
        input.focus();
      });
    }
    input.addEventListener("focus", open);
    input.addEventListener("input", function () {
      open();
    });
    input.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        input.blur();
      }
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var query = input.value.trim();
      if (query) {
        updateViewAll(query);
        window.location.href = viewAll.href;
        return;
      }
      open();
    });
    document.addEventListener("click", function (event) {
      if (!component.contains(event.target)) {
        close(false);
      }
    });
  });
})();
