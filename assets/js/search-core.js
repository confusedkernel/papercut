(function (global) {
  var indexRequests = {};

  function normalize(value) {
    var text = String(value || "").toLowerCase();
    if (text.normalize) {
      text = text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    }
    return text.replace(/\s+/g, " ").trim();
  }

  function toArray(value) {
    if (Array.isArray(value)) {
      return value.filter(Boolean).map(String);
    }
    return value ? [String(value)] : [];
  }

  function tokenize(query) {
    return normalize(query).split(/\s+/).filter(Boolean);
  }

  function buildIndexes(entries, tokenize) {
    if (!global.FlexSearch || !global.FlexSearch.Index) {
      throw new Error("FlexSearch runtime is unavailable");
    }

    var options = { tokenize: tokenize, cache: 100 };
    var fields = [
      { name: "title", weight: 100, index: new global.FlexSearch.Index(options) },
      { name: "taxonomy", weight: 60, index: new global.FlexSearch.Index(options) },
      { name: "section", weight: 20, index: new global.FlexSearch.Index(options) },
      { name: "content", weight: 30, index: new global.FlexSearch.Index(options) }
    ];

    entries.forEach(function (entry, id) {
      entry.tags = toArray(entry.tags);
      entry.categories = toArray(entry.categories);
      var values = {
        title: entry.title,
        taxonomy: entry.tags.concat(entry.categories).join(" "),
        section: entry.section,
        content: entry.content
      };
      fields.forEach(function (field) {
        if (values[field.name]) {
          field.index.add(id, String(values[field.name]));
        }
      });
    });
    entries._flexsearch = fields;
  }

  function hasValue(values, selected) {
    if (!selected) {
      return true;
    }
    return values.indexOf(normalize(selected)) !== -1;
  }

  function search(entries, state) {
    if (!entries._flexsearch) {
      buildIndexes(entries, "forward");
    }
    var query = state.query || "";
    var terms = tokenize(query);
    var section = normalize(state.type);
    var tag = normalize(state.tag);
    var category = normalize(state.category);
    var scores = {};
    var termMatches = {};

    if (terms.length) {
      terms.forEach(function (term) {
        var matchedThisTerm = {};
        entries._flexsearch.forEach(function (field) {
          var matches = field.index.search(term, entries.length);
          matches.forEach(function (id, rank) {
            matchedThisTerm[id] = true;
            scores[id] = (scores[id] || 0) + field.weight * (matches.length - rank);
          });
        });
        Object.keys(matchedThisTerm).forEach(function (id) {
          termMatches[id] = (termMatches[id] || 0) + 1;
        });
      });
    }

    return entries
      .map(function (entry, index) {
        if (section && normalize(entry.section) !== section) {
          return null;
        }
        if (!hasValue(entry.tags.map(normalize), tag) || !hasValue(entry.categories.map(normalize), category)) {
          return null;
        }
        if (terms.length && termMatches[index] !== terms.length) {
          return null;
        }
        return { entry: entry, score: scores[index] || 0, index: index };
      })
      .filter(Boolean)
      .sort(function (a, b) {
        return b.score - a.score || a.index - b.index;
      })
      .map(function (result) {
        return result.entry;
      });
  }

  function collectOptions(entries, key) {
    var values = {};
    entries.forEach(function (entry) {
      var items = key === "section" ? toArray(entry.section) : toArray(entry[key]);
      items.forEach(function (item) {
        var normalized = normalize(item);
        if (normalized && !values[normalized]) {
          values[normalized] = item;
        }
      });
    });
    return Object.keys(values)
      .map(function (keyName) { return values[keyName]; })
      .sort(function (a, b) { return a.localeCompare(b); });
  }

  function excerpt(entry, terms) {
    var summary = String(entry.summary || "").replace(/\s+/g, " ").trim();
    var content = String(entry.content || "").replace(/\s+/g, " ").trim();
    if (!terms.length || terms.some(function (term) { return normalize(summary).indexOf(term) !== -1; })) {
      return summary;
    }

    var normalizedContent = normalize(content);
    var matchAt = -1;
    terms.some(function (term) {
      matchAt = normalizedContent.indexOf(term);
      return matchAt !== -1;
    });
    if (matchAt === -1) {
      return summary;
    }

    var start = Math.max(0, matchAt - 65);
    var end = Math.min(content.length, start + 180);
    if (start > 0) {
      var nextSpace = content.indexOf(" ", start);
      start = nextSpace === -1 ? start : nextSpace + 1;
    }
    if (end < content.length) {
      var previousSpace = content.lastIndexOf(" ", end);
      end = previousSpace === -1 ? end : previousSpace;
    }
    return (start > 0 ? "..." : "") + content.slice(start, end) + (end < content.length ? "..." : "");
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* Appends text to node with query-term matches wrapped in <mark class="search-hit">. */
  function appendHighlighted(node, text, terms) {
    var value = String(text || "");
    if (!terms.length) {
      node.appendChild(document.createTextNode(value));
      return;
    }
    var pattern = new RegExp("(" + terms.map(escapeRegExp).join("|") + ")", "gi");
    value.split(pattern).forEach(function (part, index) {
      if (!part) {
        return;
      }
      if (index % 2 === 1) {
        var hit = document.createElement("mark");
        hit.className = "search-hit";
        hit.textContent = part;
        node.appendChild(hit);
      } else {
        node.appendChild(document.createTextNode(part));
      }
    });
  }

  function makeCompactResult(entry, query) {
    var terms = tokenize(query);
    var link = document.createElement("a");
    link.href = entry.url;
    link.className = "search-result search-result--compact";

    var meta = document.createElement("span");
    meta.className = "search-result__meta";
    meta.textContent = [entry.date, entry.section].filter(Boolean).join(" / ");
    link.appendChild(meta);

    var title = document.createElement("span");
    title.className = "search-result__title";
    appendHighlighted(title, entry.title, terms);
    link.appendChild(title);

    var description = excerpt(entry, terms);
    if (description) {
      var summary = document.createElement("span");
      summary.className = "search-result__excerpt";
      appendHighlighted(summary, description, terms);
      link.appendChild(summary);
    }
    return link;
  }

  /* "blog-posts" -> "Blog Posts"; CSS uppercases it, this keeps copy/paste readable. */
  function sectionLabel(section) {
    return String(section || "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, function (character) { return character.toUpperCase(); });
  }

  function makeTaxonomyLink(value, baseURL, text) {
    var link = document.createElement("a");
    link.className = "index-hover border border-[var(--border)] px-2 py-1";
    link.href = baseURL + encodeURIComponent(String(value).toLowerCase().trim().replace(/\s+/g, "-")) + "/";
    link.textContent = text;
    return link;
  }

  /* Mirrors layouts/partials/article-card.html so search results match the posts list. */
  function makeCardResult(entry, query, taxonomyURLs) {
    var terms = tokenize(query);
    var urls = taxonomyURLs || {};
    var card = document.createElement("article");
    card.className =
      "interactive-card grid gap-3 border border-[var(--border)] bg-[var(--bg-alt)] p-4 sm:grid-cols-[120px_1fr] sm:p-5 md:grid-cols-[140px_1fr]";
    card.setAttribute("data-card-href", entry.url);

    var dateColumn = document.createElement("div");
    dateColumn.className = "search-result__aside text-[0.7rem] uppercase tracking-[0.12em] text-[var(--muted)]";
    if (entry.date) {
      var time = document.createElement("time");
      if (entry.dateISO) {
        time.setAttribute("datetime", entry.dateISO);
      }
      time.textContent = entry.date;
      dateColumn.appendChild(time);
    }
    var label = sectionLabel(entry.section);
    if (label) {
      if (dateColumn.firstChild) {
        dateColumn.appendChild(document.createTextNode(" "));
      }
      var type = document.createElement("span");
      type.className = "search-result__type";
      type.textContent = label;
      dateColumn.appendChild(type);
    }
    card.appendChild(dateColumn);

    var body = document.createElement("div");
    body.className = "flex flex-col gap-2";

    var heading = document.createElement("h2");
    heading.className = "text-lg";
    var titleLink = document.createElement("a");
    titleLink.className = "hover:underline";
    titleLink.href = entry.url;
    appendHighlighted(titleLink, entry.title, terms);
    heading.appendChild(titleLink);
    body.appendChild(heading);

    var categories = toArray(entry.categories);
    var tags = toArray(entry.tags);
    if (categories.length || tags.length) {
      var labelRow = document.createElement("div");
      labelRow.className = "flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.08em] text-[var(--muted)]";
      categories.forEach(function (category) {
        labelRow.appendChild(makeTaxonomyLink(category, urls.categories || "/categories/", category));
      });
      tags.forEach(function (tag) {
        labelRow.appendChild(makeTaxonomyLink(tag, urls.tags || "/tags/", "#" + tag));
      });
      body.appendChild(labelRow);
    }

    var description = excerpt(entry, terms);
    if (description) {
      var summary = document.createElement("p");
      summary.className = "text-sm leading-relaxed text-[var(--muted)]";
      appendHighlighted(summary, description, terms);
      body.appendChild(summary);
    }
    card.appendChild(body);
    return card;
  }

  function makeResult(entry, query, compact, taxonomyURLs) {
    if (compact) {
      return makeCompactResult(entry, query);
    }
    return makeCardResult(entry, query, taxonomyURLs);
  }

  function load(url) {
    if (!indexRequests[url]) {
      indexRequests[url] = fetch(url, { credentials: "same-origin" })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Search index request failed");
          }
          return response.json();
        })
        .then(function (payload) {
          if (!payload || !Array.isArray(payload.entries)) {
            throw new Error("Search index is invalid");
          }
          buildIndexes(payload.entries, payload.tokenize || "forward");
          return payload.entries;
        });
    }
    return indexRequests[url];
  }

  global.PapercutSearch = {
    collectOptions: collectOptions,
    load: load,
    makeResult: makeResult,
    normalize: normalize,
    search: search
  };
})(window);
