(function () {
  // Animates the outside ToC folding away (and back in) when the viewport
  // crosses the 1280px (xl) breakpoint, mirroring header-collapse.js. Only runs
  // on an actual breakpoint change, never on page load. The CSS lives in
  // toc-timeline.css (.is-toc-*).
  var toc = document.querySelector(".toc-outside");
  if (!toc || !window.matchMedia) {
    return;
  }

  var wide = window.matchMedia("(min-width: 1280px)");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var DURATION = 270;
  var timer = null;

  // Stagger index for each row, top to bottom (capped so long ToCs stay snappy).
  var rows = toc.querySelectorAll(".toc-outside__title, .toc a");
  for (var i = 0; i < rows.length; i++) {
    rows[i].style.setProperty("--toc-i", Math.min(i, 8));
  }

  function clear() {
    toc.classList.remove("is-toc-collapsing", "is-toc-expanding");
  }

  function onChange(event) {
    clearTimeout(timer);
    clear();
    if (reduceMotion.matches) {
      return;
    }

    // Force a reflow so a quick back-and-forth resize restarts the animation.
    void toc.offsetWidth;
    toc.classList.add(event.matches ? "is-toc-expanding" : "is-toc-collapsing");
    timer = setTimeout(clear, DURATION);
  }

  if (wide.addEventListener) {
    wide.addEventListener("change", onChange);
  } else if (wide.addListener) {
    wide.addListener(onChange);
  }
})();
