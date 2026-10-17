(function () {
  var bar = document.querySelector("[data-reading-progress]");
  var article = document.querySelector("main article");
  if (!bar || !article) {
    return;
  }

  var header = bar.closest(".site-header");
  var ticking = false;

  function update() {
    ticking = false;

    var headerHeight = header ? header.offsetHeight : 0;
    var rect = article.getBoundingClientRect();
    var distance = rect.height - (window.innerHeight - headerHeight);
    var read = headerHeight - rect.top;
    var progress = distance > 0 ? read / distance : read > 0 ? 1 : 0;

    progress = Math.min(1, Math.max(0, progress));
    bar.style.transform = "scaleX(" + progress + ")";
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  update();

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
})();
