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

  const getUrl = ($url) => {
    let url = $url.split("//");
    if (url[0] === "http:" || url[0] === "https:") {
      const protocol = url[0] + "//";
      let host = url[1].split("/")[0];
      url = protocol + host;
      const path = $url.split(url)[1];
      const lastArr = $url.split("/dist/"),
        last = lastArr.slice(-1).pop();

      return {
        protocol: protocol,
        host: host,
        path: path,
        last: last,
      };
    }
  };

  /**
   * Preloader
   * */
  window.addEventListener("load", () => {
    const preloaderGroup = document.getElementById("preloaderGroup");
    if (preloaderGroup) {
      preloaderGroup.classList.add("vanish");
      setTimeout(() => {
        preloaderGroup.style.display = "none";
      }, 500);
    }

    // open side menu item
    if (url_vars?.toggle) {
      const parentLi = $(document).find(".collapse-item");
      if (parentLi && parentLi.length > 0) {
        const collapseMenu = parentLi.find(`#${url_vars?.toggle}`),
          collapseLink = parentLi.find(`.nav-link`),
          locationUrlArr = getUrl(window.location.href),
          linkHref = locationUrlArr?.last;

        // open collapsed menu
        collapseLink.removeClass("collapsed");
        collapseMenu.addClass("show");
        parentLi.addClass("active");

        // set active side menu item based on location href
        parentLi.find(`.nav-link`).each(function () {
          const current = $(this),
            currentHref = current.attr("href");
          if (linkHref == currentHref) {
            current.parent(".nav-item").addClass("active");
          }
        });
      }
    }
  });
  // END - Preloader

  $(window).on("load ready resize orientationChange", function () {
    const mainCointainer = document.querySelector("main.main-container"),
      headerNav = document.querySelector(".main-header > nav.navbar"),
      headerNavHeight =
        headerNav && headerNav?.length > 0 && headerNav.offsetHeight;
    mainCointainer &&
    (mainCointainer.style["padding-top"] = headerNavHeight + "px");

    // Set same height for events-item
    if (
      $(window).width() >= 576 &&
      $(document).find(".event-results").length > 0
    ) {
      $(document)
        .find(".event-results .event-item:not(.full-width)")
        .equalHeight();
    }
  });

  $(document).ready(function () {
    // left margin for main container
    const menu = $(document).find(".main-header .navbar .container"),
      margin_left = menu.length > 0 ? menu.offset().left : "auto",
      home_banner_content = $(document).find(
        ".features-banner-home .banner-content-wrapper"
      );

    // home banner set left marging
    if (
      $(window).width() >= 1164 &&
      $(document).find(".event-results").length > 0
    ) {
      home_banner_content.length > 0 &&
      home_banner_content.css({"margin-left": margin_left + "px"});
    }

    // Customize inputs
    $('input[name="dates"]').daterangepicker({
      locale: {
        format: "YYYY.MM.DD",
      },
    });
    $("#date-of-birth").datepicker({
      dateFormat: "dd/mm/yy",
    });
    $('input[name="dates"]').val("");
    $('input[name="dates"]').attr("placeholder");

    $(".search-select").selectize({
      onInitialize: function () {
        $("#select-country-selectized").attr(
          "data-parsley-errors-container",
          "#errors"
        );
      },
    });

    /* Inicialize Tooltip */
    $('[data-bs-toggle="tooltip"]').tooltip();

    // replace init action on collapse button
    $(".nav-item").on("click", function (e) {
      const currentItem = $(this),
        link = currentItem.find(".nav-link"),
        linkHref = link.attr("href");

      if (currentItem.hasClass("collapse-item")) {
        const newPath = `${window.location.origin}/dist/${linkHref}`;
        window.location.href = newPath;
      }
    });

    /* Inicialize Tables */
    // $('#dtBasicExample').DataTable();
  });

  $(document).on('click', '.filter-toggle', function () {
    if ($(".form-events-filter").length > 0) {
      $(".form-events-filter").toggleClass("active");
    }
    if ($(".form-news-filter").length > 0) {
      $(".form-news-filter").toggleClass("active");
    }

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


  $('#search-member-admin').selectize({
    searchField: ['text'],
    render: {
      option: function (item, escape) {
        if (item.type == 'user') {
          return '<div><span class="search-image"><img src="' + item.image + '"></span><span>' + item.text + '</span></div>';
        }
        if (item.type == 'event') {
          return '<div><span class="search-image-event"><img src="' + item.image + '"></span><span>' + item.text + '</span></div>';
        }
      }
    }
  });

  $('#search-collective-members-country').selectize({
    searchField: ['text'],
    render: {
      option: function (item, escape) {
        return '<div>' + item.text + '</div>';
      }
    }
  });

  $("#search-collective-members-keyword").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#search-collective-members-list .list-group-item").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });


    if (value == "") {
      $('.list-group-item').unhighlight();
      return;
    }

    $('.list-group-item').unhighlight();
    $('.list-group-item').highlight(value);

    $('.search-result').show();
    $('.search-result').text('Search results for “' + $(this).val()+ '”');
    if( $(this).val() == ''){
      $('.search-result').hide()
    }
  });


  $('#spoken-language').select2({
      placeholder: {
        id: '-1', // the value of the option
        text: 'Add more'
      }
    }
  ).on('select2:close', function (e) {
    $('.select2-search__field').attr('placeholder', 'Add more');
  });

  $('.event-slider').slick({
    dots: true,
    infinite: false,
    autoplay: false,
    prevArrow: $('.prev'),
    nextArrow: $('.next'),
    appendDots: $('.slick-slider-dots'),
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    customPaging: function (slider, i) {
      let current_i = i + 1;
      let item_li = $(i).length;
      console.log(slider)
      return '<button class="tab">' + current_i + ' of ' + 3 + '</button>';
    },
    responsive: [
      {
        breakpoint: 1401,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });


})(jQuery);

jQuery.extend({
  highlight: function(node, re, nodeName, className) {
    if (node.nodeType === 3) {
      var match = node.data.match(re);
      if (match) {
        var highlight = document.createElement(nodeName || 'span');
        highlight.className = className || 'highlight';
        var wordNode = node.splitText(match.index);
        wordNode.splitText(match[0].length);
        var wordClone = wordNode.cloneNode(true);
        highlight.appendChild(wordClone);
        wordNode.parentNode.replaceChild(highlight, wordNode);
        return 1; //skip added node in parent
      }
    } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
      !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
      !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
      for (var i = 0; i < node.childNodes.length; i++) {
        i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
      }
    }
    return 0;
  }
});

jQuery.fn.unhighlight = function(options) {
  var settings = {
    className: 'highlight',
    element: 'span'
  };
  jQuery.extend(settings, options);

  return this.find(settings.element + "." + settings.className).each(function() {
    var parent = this.parentNode;
    parent.replaceChild(this.firstChild, this);
    parent.normalize();
  }).end();
};

jQuery.fn.highlight = function(words, options) {
  var settings = {
    className: 'highlight',
    element: 'span',
    caseSensitive: false,
    wordsOnly: false
  };
  jQuery.extend(settings, options);

  if (words.constructor === String) {
    words = [words];
  }
  words = jQuery.grep(words, function(word, i) {
    return word != '';
  });
  words = jQuery.map(words, function(word, i) {
    return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  });
  if (words.length == 0) {
    return this;
  };

  var flag = settings.caseSensitive ? "" : "i";
  var pattern = "(" + words.join("|") + ")";
  if (settings.wordsOnly) {
    pattern = "\\b" + pattern + "\\b";
  }
  var re = new RegExp(pattern, flag);

  return this.each(function() {
    jQuery.highlight(this, re, settings.element, settings.className);
  });
};

