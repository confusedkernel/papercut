window.__papercut = {
  hasSelection: function () {
    var selection = window.getSelection ? window.getSelection() : null;
    return Boolean(selection && String(selection).trim());
  },
};
