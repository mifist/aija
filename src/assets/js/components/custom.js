(function ($) {
  'use_strict';

  $.fn.equalHeight = function () {
    let tallest = 0;
    this.each(function () {
      let thisHeight = $(this).height();
      tallest = (thisHeight > tallest) ? thisHeight : tallest;
    });
    return this.height(tallest);
  };

  let is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
  const is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
  const is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
  let is_safari = navigator.userAgent.indexOf("Safari") > -1;
  const is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
  if ((is_chrome) && (is_safari)) {
    is_safari = false;
  }
  if ((is_chrome) && (is_opera)) {
    is_chrome = false;
  }

  const getUrlVars = () => {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      vars[key] = value;
    });
    return vars;
  };

  const url_vars = getUrlVars();


  /**
   * Preloader
   * */
  window.addEventListener("load", () => {
    const preloaderGroup = document.getElementById("preloaderGroup");

    if (preloaderGroup) {
      console.log(preloaderGroup);
      preloaderGroup.classList.add("vanish");
      setTimeout(() => {
        preloaderGroup.style.display = "none";
      }, 500);
    }
  });
  // END - Preloader


  $(window).on('load ready resize orientationChange', function () {

    const mainCointainer = document.querySelector('main.main-container'),
      headerNav = document.querySelector('.main-header > nav.navbar'),
      headerNavHeight = headerNav.offsetHeight;
    mainCointainer && (mainCointainer.style['padding-top'] = headerNavHeight + 'px');

    // Set same height for events-item
    if ( $(window).width() >= 576
				&& $(document).find('.event-results').length > 0 ) {
					$(document).find('.event-results .event-item:not(.full-width)').equalHeight();
    }

  });


  $(document).ready(function () {

    // left margin for main container
    const menu = $(document).find('.main-header .navbar .container'),
      margin_left = menu.length > 0 ? menu.offset().left : 'auto',
      home_banner_content = $(document).find('.features-banner-home .banner-content-wrapper');

    // home banner set left marging
    if ( $(window).width() >= 1164
      && $(document).find('.event-results').length > 0 ) {
      home_banner_content.length > 0 &&
        home_banner_content.css({ 'margin-left': margin_left + 'px' });
    }
    

    // Customize inputs
    $('input[name="dates"]').daterangepicker(
      {
        locale: {
          format: 'YYYY.MM.DD'
        }
      }
    );
    $('input[name="dates"]').val('');
    $('input[name="dates"]').attr("placeholder");

    $('.search-select').selectize({
      onInitialize: function(){
        $("#select-country-selectized").attr("data-parsley-errors-container", "#errors");
      }
    });
  

  });

  $(document).on('click', '.filter-toggle', function () {
    $('.form-events-filter').toggleClass('active');
  });

  const event_menu = $('#event-nav'),
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


  $(document).on('mouseenter', '.general_info-button a', function () {
    const name = $(this).data('hover');
    $(this).text(name);
  });

  $(document).on('mouseout', '.general_info-button a', function () {
    const name = $(this).data('value');
    $(this).text(name);
  });


})(jQuery);


