(function () {
  var cardSelector = "[data-card-href]";

  function shouldIgnore(target) {
    return !!target.closest("a, button, input, textarea, select, summary, label, [data-no-card-nav]");
  }

  function hydrateCard(card) {
    if (!card || card.nodeType !== 1 || card.getAttribute("data-card-nav-ready") === "true") {
      return;
    }

    var href = card.getAttribute("data-card-href");
    if (!href) {
      return;
    }

    if (!card.hasAttribute("role")) {
      card.setAttribute("role", "link");
    }
    if (!card.hasAttribute("tabindex")) {
      card.setAttribute("tabindex", "0");
    }
    card.setAttribute("data-card-nav-ready", "true");
  }

  function hasSelection() {
    var selected = window.getSelection ? window.getSelection().toString() : "";
    return selected && selected.trim().length > 0;
  }

  function navigate(card) {
    var href = card.getAttribute("data-card-href");
    if (!href) {
      return;
    }
    window.location.href = href;
  }

  function getCardTarget(target) {
    if (!target || !target.closest) {
      return null;
    }
    return target.closest(cardSelector);
  }

  document.querySelectorAll(cardSelector).forEach(hydrateCard);

  document.addEventListener("click", function (event) {
    var card = getCardTarget(event.target);
    if (!card || event.defaultPrevented || shouldIgnore(event.target) || hasSelection()) {
      return;
    }
    navigate(card);
  });

  document.addEventListener("keydown", function (event) {
    var card = getCardTarget(event.target);
    if (!card || event.defaultPrevented || shouldIgnore(event.target)) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (hasSelection()) {
        return;
      }
      navigate(card);
    }
  });

  if (!("MutationObserver" in window)) {
    return;
  }

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (!node || node.nodeType !== 1) {
          return;
        }

        if (node.matches && node.matches(cardSelector)) {
          hydrateCard(node);
        }

        if (node.querySelectorAll) {
          node.querySelectorAll(cardSelector).forEach(hydrateCard);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
