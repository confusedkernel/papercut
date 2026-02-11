(function () {
  var tocRoot = document.querySelector(".toc nav#TableOfContents");
  if (!tocRoot) {
    return;
  }

  var links = Array.prototype.slice.call(tocRoot.querySelectorAll('a[href^="#"]'));
  if (!links.length) {
    return;
  }

  var items = links
    .map(function (link) {
      var id = decodeURIComponent((link.getAttribute("href") || "").slice(1));
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
