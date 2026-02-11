(function () {
  var tocRoot = document.querySelector(".toc nav#TableOfContents");
  if (!tocRoot) {
    return;
  }

  function decodeHrefId(href) {
    return decodeURIComponent((href || "").replace(/^#/, ""));
  }

  function getDirectChildList(item) {
    if (!item) {
      return null;
    }

    for (var i = 0; i < item.children.length; i += 1) {
      if (item.children[i].tagName === "UL") {
        return item.children[i];
      }
    }

    return null;
  }

  function findTocLinkById(id) {
    if (!id) {
      return null;
    }

    var anchors = tocRoot.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i += 1) {
      if (decodeHrefId(anchors[i].getAttribute("href")) === id) {
        return anchors[i];
      }
    }

    return null;
  }

  function appendStepsHeadingsToToc() {
    var rootList = tocRoot.querySelector("ul");
    if (!rootList) {
      return;
    }

    var existing = Object.create(null);
    var existingLinks = tocRoot.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < existingLinks.length; i += 1) {
      var existingId = decodeHrefId(existingLinks[i].getAttribute("href"));
      if (existingId) {
        existing[existingId] = true;
      }
    }

    var stepBlocks = document.querySelectorAll('.sc-steps:not([data-toc-exclude="true"])');
    if (!stepBlocks.length) {
      return;
    }

    stepBlocks.forEach(function (block) {
      var headings = block.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]");
      if (!headings.length) {
        return;
      }

      var targetList = rootList;
      var cursor = block.previousElementSibling;

      while (cursor) {
        if (/^H[1-6]$/.test(cursor.tagName) && cursor.id) {
          var parentLink = findTocLinkById(cursor.id);
          if (parentLink) {
            var parentItem = parentLink.closest("li");
            if (parentItem) {
              var nested = getDirectChildList(parentItem);
              if (!nested) {
                nested = document.createElement("ul");
                parentItem.appendChild(nested);
              }
              targetList = nested;
            }
          }
          break;
        }
        cursor = cursor.previousElementSibling;
      }

      headings.forEach(function (heading) {
        if (!heading.id || existing[heading.id]) {
          return;
        }

        var item = document.createElement("li");
        var link = document.createElement("a");
        link.setAttribute("href", "#" + encodeURIComponent(heading.id));
        link.textContent = heading.textContent || heading.id;
        item.appendChild(link);
        targetList.appendChild(item);
        existing[heading.id] = true;
      });
    });
  }

  appendStepsHeadingsToToc();

  var links = Array.prototype.slice.call(tocRoot.querySelectorAll('a[href^="#"]'));
  if (!links.length) {
    return;
  }

  var items = links
    .map(function (link) {
      var id = decodeHrefId(link.getAttribute("href"));
      if (!id) {
        return null;
      }
      var heading = document.getElementById(id);
      if (!heading) {
        return null;
      }
      return { link: link, heading: heading };
    })
    .filter(Boolean);

  if (!items.length) {
    return;
  }

  function setActive(activeLink) {
    links.forEach(function (link) {
      var isActive = link === activeLink;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function findActiveByScroll() {
    var threshold = 160;
    var current = items[0].link;

    for (var i = 0; i < items.length; i += 1) {
      if (items[i].heading.getBoundingClientRect().top <= threshold) {
        current = items[i].link;
      } else {
        break;
      }
    }

    setActive(current);
  }

  if ("IntersectionObserver" in window) {
    var visible = new Set();

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id;
          if (!id) {
            return;
          }
          if (entry.isIntersecting) {
            visible.add(id);
          } else {
            visible.delete(id);
          }
        });

        var active = null;
        for (var i = items.length - 1; i >= 0; i -= 1) {
          if (visible.has(items[i].heading.id)) {
            active = items[i].link;
            break;
          }
        }

        if (active) {
          setActive(active);
        } else {
          findActiveByScroll();
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 1],
      }
    );

    items.forEach(function (item) {
      observer.observe(item.heading);
    });
  }

  window.addEventListener("scroll", findActiveByScroll, { passive: true });
  window.addEventListener("resize", findActiveByScroll);
  findActiveByScroll();
})();
