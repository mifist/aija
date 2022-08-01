(function mainScript() {
  "use strict";

  /* OffCanvas */
  const offcanvasToggle = document.querySelector(
    '[data-bs-toggle="offcanvas"]',
  );
  const offcanvasToggleClose = document.querySelector(
    '[data-bs-toggle="close-offcanvas"]',
  );
  const offcanvasCollapse = document.querySelector(".offcanvas-collapse");

  offcanvasToggle && offcanvasToggle.addEventListener("click", function () {
    const headerNav = document.querySelector('.main-header > nav.navbar');
    /* Add Height of navbar */
    if ( headerNav && headerNav?.length > 0 && offcanvasCollapse.classList.contains('open') ) {
      offcanvasCollapse.style.top = 0;
    } else if ( headerNav && headerNav?.length > 0 && !offcanvasCollapse.classList.contains('open') ) {
      console.log(headerNav.offsetHeight)
      offcanvasCollapse.style.top = headerNav.offsetHeight+'px';
    }
    // main action
    offcanvasCollapse.classList.toggle("open");
    
  });

  offcanvasToggleClose && offcanvasToggleClose.addEventListener("click", function () {
    const headerNav = document.querySelector('.main-header > nav.navbar');
    /* Add Height of navbar */
    if ( headerNav && headerNav?.length > 0 && offcanvasCollapse.classList.contains('open') ) {
      offcanvasCollapse.style.top = 0;
    } else if ( headerNav && headerNav?.length > 0 && !offcanvasCollapse.classList.contains('open') ) {
      console.log(headerNav.offsetHeight);
      offcanvasCollapse.style.top = headerNav.offsetHeight+'px';
    }
    // main action
    offcanvasCollapse.classList.toggle("open");
  });

  /* Header Search Bar */
  const searchbarToggle = document.querySelector(
    '[data-bs-toggle="searchbar"]',
  );
  const searchbarCollapse = document.querySelector(".searchbar-collapse");
  searchbarToggle && searchbarToggle.addEventListener("click", function () {
    const searchInput = searchbarCollapse.querySelector('[type="search"]'),
          headerNav = document.querySelector('.main-header > nav.navbar'),
      headerNavHeight = headerNav && headerNav.offsetHeight;
    if ( headerNav && headerNav?.length > 0 && searchbarCollapse.classList.contains('open') ) {
      searchbarCollapse.style.top = 0;
    } else if ( headerNav && headerNav?.length > 0 && !searchbarCollapse.classList.contains('open') ) {
      searchbarCollapse.style.top = headerNavHeight+'px';
    }
    // main action
    searchbarCollapse.classList.toggle("open");
    searchInput.focus();
  });


})();
