(function () {
  var headings = Array.prototype.slice.call(
    document.querySelectorAll(".post-content h1[id], .post-content h2[id], .post-content h3[id], .post-content h4[id], .post-content h5[id], .post-content h6[id]")
  );

  if (!headings.length) {
    return;
  }

  function hasSelection() {
    var selection = window.getSelection ? window.getSelection() : null;
    return Boolean(selection && String(selection).trim());
  }

  function goToHeading(heading) {
    var id = heading.id;
    if (!id) {
      return;
    }

    var hash = "#" + encodeURIComponent(id);
    if (window.location.hash === hash) {
      history.replaceState(null, "", hash);
    } else {
      history.pushState(null, "", hash);
    }

    heading.scrollIntoView({ block: "start" });
  }

  headings.forEach(function (heading) {
    heading.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        return;
      }

      if (hasSelection()) {
        return;
      }

      goToHeading(heading);
    });
  });
})();
