(function () {
  var STORAGE_KEY = "papercut-theme";
  var THEMES = ["system", "light", "dark"];

  function getSavedTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        stored = localStorage.getItem("cardinal-theme");
        if (stored) {
          localStorage.setItem(STORAGE_KEY, stored);
        }
      }
      return THEMES.indexOf(stored) >= 0 ? stored : "system";
    } catch (e) {
      return "system";
    }
  }

  function prefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function applyCodeTheme(theme) {
    var link = document.getElementById("chroma-theme");
    if (!link) {
      return;
    }

    var lightHref = link.getAttribute("data-light-href");
    var darkHref = link.getAttribute("data-dark-href");
    var resolved = theme === "system" ? (prefersDark() ? "dark" : "light") : theme;
    var nextHref = resolved === "dark" ? darkHref : lightHref;

    if (nextHref && link.getAttribute("href") !== nextHref) {
      link.setAttribute("href", nextHref);
    }
  }

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    var controls = document.querySelectorAll("[data-theme-cycle]");
    controls.forEach(function (control) {
      control.setAttribute("data-theme-current", theme);
      control.setAttribute("aria-label", "Theme: " + theme + ". Click to switch.");
    });

    applyCodeTheme(theme);
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
  }

  function getNextTheme(theme) {
    var idx = THEMES.indexOf(theme);
    if (idx < 0) {
      return THEMES[0];
    }
    return THEMES[(idx + 1) % THEMES.length];
  }

  document.addEventListener("click", function (event) {
    var control = event.target.closest("[data-theme-cycle]");
    if (!control) {
      return;
    }

    var current = control.getAttribute("data-theme-current") || getSavedTheme();
    var theme = getNextTheme(current);

    saveTheme(theme);
    applyTheme(theme);
  });

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      if (getSavedTheme() === "system") {
        applyCodeTheme("system");
      }
    });
  }

  applyTheme(getSavedTheme());
})();
