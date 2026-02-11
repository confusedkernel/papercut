(function () {
  function getLanguageLabel(codeNode) {
    var dataLang = codeNode.getAttribute("data-lang");
    if (dataLang) {
      return dataLang.toUpperCase();
    }

    var className = codeNode.className || "";
    var match = className.match(/language-([a-zA-Z0-9_+-]+)/);
    if (match && match[1]) {
      return match[1].toUpperCase();
    }

    return "TEXT";
  }

  function copyCode(codeNode, button, label) {
    var text = codeNode.textContent || "";
    navigator.clipboard
      .writeText(text)
      .then(function () {
        button.dataset.state = "copied";
        button.textContent = "COPIED";
        setTimeout(function () {
          button.dataset.state = "idle";
          button.textContent = label;
        }, 2000);
      })
      .catch(function () {
        button.dataset.state = "error";
        button.textContent = "ERROR";
        setTimeout(function () {
          button.dataset.state = "idle";
          button.textContent = label;
        }, 2000);
      });
  }

  document.querySelectorAll(".post-content .highlight").forEach(function (block) {
    if (block.querySelector(".code-copy-btn")) {
      return;
    }

    var codeNode = block.querySelector("pre code");
    if (!codeNode) {
      return;
    }

    var language = getLanguageLabel(codeNode);
    var button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy-btn";
    button.dataset.state = "idle";
    button.dataset.lang = language;
    button.textContent = language;
    button.setAttribute("aria-label", "Copy " + language + " code");

    button.addEventListener("mouseenter", function () {
      if (button.dataset.state === "idle") {
        button.textContent = "COPY";
      }
    });

    button.addEventListener("mouseleave", function () {
      if (button.dataset.state === "idle") {
        button.textContent = language;
      }
    });

    button.addEventListener("click", function () {
      copyCode(codeNode, button, language);
    });

    block.prepend(button);
  });
})();
