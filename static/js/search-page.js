(function () {
  var dataNode = document.getElementById("search-data");
  var form = document.getElementById("search-page-form");
  var input = document.getElementById("search-page-input");
  var resultsNode = document.getElementById("search-results");
  var countNode = document.getElementById("search-count");
  var emptyNode = document.getElementById("search-empty");

  if (!dataNode || !form || !input || !resultsNode || !countNode || !emptyNode) {
    return;
  }

  var entries = [];
  try {
    entries = JSON.parse(dataNode.textContent || "[]");
    if (typeof entries === "string") {
      entries = JSON.parse(entries);
    }
    if (!Array.isArray(entries)) {
      entries = [];
    }
  } catch (e) {
    entries = [];
  }

  function tokenize(query) {
    return query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }

  function matches(entry, terms) {
    if (!terms.length) {
      return true;
    }

    var haystack = [entry.title, entry.summary, entry.tags, entry.categories, entry.section]
      .join(" ")
      .toLowerCase();

    return terms.every(function (term) {
      return haystack.indexOf(term) !== -1;
    });
  }

  function makeResultCard(entry) {
    var card = document.createElement("article");
    card.className =
      "interactive-card grid gap-3 border border-[var(--border)] bg-[var(--bg-alt)] p-4 sm:grid-cols-[120px_1fr] sm:p-5 md:grid-cols-[140px_1fr]";
    card.setAttribute("data-card-href", entry.url);

    var meta = document.createElement("p");
    meta.className = "text-[0.7rem] uppercase tracking-[0.1em] text-[var(--muted)]";
    meta.textContent = entry.date + " - " + entry.section;
    card.appendChild(meta);

    var body = document.createElement("div");
    body.className = "flex flex-col gap-2";

    var title = document.createElement("h2");
    title.className = "text-lg";
    var link = document.createElement("a");
    link.href = entry.url;
    link.className = "hover:underline";
    link.textContent = entry.title;
    title.appendChild(link);
    body.appendChild(title);

    if (entry.summary) {
      var summary = document.createElement("p");
      summary.className = "text-sm leading-relaxed text-[var(--muted)]";
      summary.textContent = entry.summary;
      body.appendChild(summary);
    }

    card.appendChild(body);

    return card;
  }

  function render(query) {
    var terms = tokenize(query);
    var matched = entries.filter(function (entry) {
      return matches(entry, terms);
    });

    if (!terms.length) {
      matched = matched.slice(0, 12);
      countNode.textContent = "Showing latest " + matched.length + " entries";
    } else {
      countNode.textContent = matched.length + " result" + (matched.length === 1 ? "" : "s") + " for \"" + query + "\"";
    }

    resultsNode.innerHTML = "";

    if (!matched.length) {
      emptyNode.classList.remove("hidden");
      return;
    }

    emptyNode.classList.add("hidden");
    matched.forEach(function (entry) {
      resultsNode.appendChild(makeResultCard(entry));
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var query = input.value.trim();
    var url = new URL(window.location.href);
    if (query) {
      url.searchParams.set("q", query);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState({}, "", url.toString());
    render(query);
  });

  var initialQuery = new URL(window.location.href).searchParams.get("q") || "";
  input.value = initialQuery;
  render(initialQuery);
})();
