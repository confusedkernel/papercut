(function () {
  var header = document.querySelector(".site-header");
  if (!header) {
    return;
  }

  var mobileMenu = header.querySelector(".mobile-nav");

  function syncScrolled() {
    header.classList.toggle("is-scrolled", window.scrollY > 0);
  }

  function syncMobileMenu() {
    header.classList.toggle("is-mobile-menu-open", !!(mobileMenu && mobileMenu.open));
  }

  syncScrolled();
  syncMobileMenu();

  window.addEventListener("scroll", syncScrolled, { passive: true });
  if (mobileMenu) {
    mobileMenu.addEventListener("toggle", syncMobileMenu);
  }
})();
