(function () {
  var toggles = document.querySelectorAll("[data-search-toggle]");
  if (!toggles.length) {
    return;
  }

  toggles.forEach(function (form) {
    var button = form.querySelector("[data-search-toggle-button]");
    var input = form.querySelector("[data-search-toggle-input]");
    if (!button || !input) {
      return;
    }

    function open() {
      form.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      button.setAttribute("aria-label", "Search");
      setTimeout(function () {
        input.focus();
      }, 140);
    }

    function close() {
      if (input.value.trim() !== "") {
        return;
      }
      form.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open search");
    }

    button.addEventListener("click", function () {
      if (!form.classList.contains("is-open")) {
        open();
        return;
      }
      if (input.value.trim() !== "") {
        form.submit();
      }
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        input.value = "";
        close();
      }
    });

    input.addEventListener("blur", function () {
      setTimeout(close, 80);
    });

    document.addEventListener("click", function (event) {
      if (!form.contains(event.target)) {
        close();
      }
    });
  });
})();
