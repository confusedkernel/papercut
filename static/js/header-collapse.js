(function () {
  // Animates the desktop nav folding into the burger (and back out) when the
  // viewport crosses the 860px breakpoint. Only runs on an actual breakpoint
  // change, never on page load. The CSS lives in chrome.css (.is-nav-*).
  var header = document.querySelector(".site-header");
  if (!header || !window.matchMedia) {
    return;
  }

  var wide = window.matchMedia("(min-width: 861px)");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mobileMenu = header.querySelector(".mobile-nav");
  var DURATION = 520;
  var timer = null;

  function clear() {
    header.classList.remove("is-nav-collapsing", "is-nav-expanding");
  }

  function onChange(event) {
    if (event.matches && mobileMenu && mobileMenu.open) {
      mobileMenu.open = false;
    }

    clearTimeout(timer);
    clear();
    if (reduceMotion.matches) {
      return;
    }

    // Force a reflow so a quick back-and-forth resize restarts the animation.
    void header.offsetWidth;
    header.classList.add(event.matches ? "is-nav-expanding" : "is-nav-collapsing");
    timer = setTimeout(clear, DURATION);
  }

  if (wide.addEventListener) {
    wide.addEventListener("change", onChange);
  } else if (wide.addListener) {
    wide.addListener(onChange);
  }
})();
