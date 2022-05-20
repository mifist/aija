(function ($) {
  'use_strict';

  let doc = $(document);

  $.fn.equalHeight = function () {
    let tallest = 0;
    this.each(function () {
      let thisHeight = $(this).height();
      tallest = (thisHeight > tallest) ? thisHeight : tallest;
    });
    return this.height(tallest);
  };

  let is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
  let is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
  let is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
  let is_safari = navigator.userAgent.indexOf("Safari") > -1;
  let is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
  if ((is_chrome) && (is_safari)) {
    is_safari = false;
  }
  if ((is_chrome) && (is_opera)) {
    is_chrome = false;
  }

  const getUrlVars = () => {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      vars[key] = value;
    });
    return vars;
  };

  var url_vars = getUrlVars();


  /**
   * Preloader
   * */
  window.addEventListener("load", () => {
    let preloaderGroup = document.getElementById("preloaderGroup");

    if (preloaderGroup) {
      console.log(preloaderGroup);
      preloaderGroup.classList.add("vanish");
      setTimeout(() => {
        preloaderGroup.style.display = "none";
      }, 500);
    }
  });
  // END - Preloader


  $(document).ready(function () {

    /*       if (navigator.userAgent.indexOf('Mac') > 0)
               $('body').addClass('mac-os');*/


  });

  $(window).on('load ready resize orientationChange', function () {
    const mainCointainer = document.querySelector('main.main-container'),
      headerNav = document.querySelector('.main-header > nav.navbar'),
      headerNavHeight = headerNav.offsetHeight;
    mainCointainer && (mainCointainer.style['padding-top'] = headerNavHeight + 'px');
  });


  $(document).ready(function () {

    $('input[name="dates"]').daterangepicker(
      {
        locale: {
          format: 'YYYY.MM.DD'
        }
      }
    );
    $('input[name="dates"]').val('');
    $('input[name="dates"]').attr("placeholder");
  });

  $(document).on('click', '.filter-toggle', function () {
    $('.form-events-filter').toggleClass('active');
  });

  let event_menu = $('#event-nav'),
    menu_item = $('#event-nav .menu-item a'),
    event_menu_btn = $('.event-nav-toggle span');
  if (event_menu) {
    let current_li = $(event_menu).find('li.active>a');
    $(event_menu_btn).text($(current_li).text());
  }

  $(document).on('click', '.event-nav-toggle', function () {
    $('#event-nav').toggleClass('show');
  });


  $(document).on('click', function (e) {
    if (!$(e.target).closest(".event-menu").length) {
      $('#event-nav').removeClass('show');
    }
  });
  $(menu_item).on('click', function (e) {
    $('#event-nav').removeClass('show');
    $(event_menu_btn).text($(this).text());
  });

  $(function () {
    $('.event-menu a').click(function () {

      // Check for active
      $('.event-menu li').removeClass('active');
      $(this).parent().addClass('active');

      // Display active tab
      let currentTab = $(this).attr('data-tabs');
      let currentTab2 = $(this).attr('data-tabs2');
      $('.tabs-content .tab-item-content').removeClass('active');
      $(currentTab).addClass('active');
      $(currentTab2).addClass('active');
      return false;
    });
  });


})(jQuery);


