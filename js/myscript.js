$(document).ready(function(){
  // ################################################
  // Add smooth scrolling to all links
  // borrowed from http://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_eff_animate_smoothscroll
  // ################################################

  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 600, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    }
  });

  // ################################################
  // portrait image swap
  // ################################################

  $('#portrait-cont').hover(
    function() {
      $("#portrait").attr("src","assets/me2.jpg");
    }, function () {
      $("#portrait").attr("src","assets/me.jpg");
  });

  // ################################################
  // modal 
  // modified from bootstrap
  // ################################################

  $('#modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var recipient = button.data('whatever');// Extract info from data-* attributes
    var image = button.find('img');
    var src = image.attr("src");
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);
    modal.find('.modal-title').text(recipient);
    var imgDiv = modal.find('.modal-body #imghere');
    imgDiv.css("background-image", "url(" + src + ")");
  })
});

$(window).load(function(){
  // ################################################
  // portfolio item interaction + animation
  // ################################################

  var currentContRatio = 0;

  // determine aspect ratio of container
  function setWorkRatio () {
    var imgContainer = $(".work-item-pad");
    var contWidth = $(imgContainer).width(); // Max width for the image
    var contHeight = $(imgContainer).height(); // Max height for the image
    var contRatio = contWidth / contHeight; // Used for cont aspect ratio
    
    // if aspect ratio has changed, resize all images
    if (contRatio != currentContRatio) {
      sizeAll();
      currentContRatio = contRatio;
    }
  }

  // update scale & position of image
  function sizeWork(img, scale, anim) {
    // determine aspect ratio of container
    var cont = img.parent();
    var contWidth = $(cont).width(); // Max width for the image
    var contWidthScl = contWidth * scale;
    var contHeight = $(cont).height(); // Max height for the image
    var contHeightScl = contHeight * scale;
    var contRatio = contWidthScl / contHeightScl; // Used for cont aspect ratio
    var imgWidth = $(img).width();    // Current image width
    var imgHeight = $(img).height();  // Current image height
    var imgRatio = imgWidth / imgHeight; // Used for img aspect ratio
    var fade = 0;
    if (anim) {fade = 400;}

    // custom image offsets
    var x = 0,
        y = 0;

    if (contRatio > 3) {
      // <= 992
      x = parseInt(img.data('wx'));
      y = parseInt(img.data('wy'));
    } else {
      // > 992
      x = parseInt(img.data('nx'));
      y = parseInt(img.data('ny'));
    }

    if (isNaN(x)) {x = 0;}
    if (isNaN(y)) {y = 0;}

    // determine location and size of vignette overlay
    var overlay = img.parent().find(".work-item-overlay");
    overlay.css("width", contWidth);
    overlay.css("height", contHeight);
    overlay.css("top", cont.position().top);
    overlay.css("left", cont.position().left);

    // determine image position & size based on container aspect ratio
    if (contRatio > imgRatio) {
      // image is stouter than container 
      var newWidth = contWidthScl;
      var newHeight = contWidthScl / imgRatio;
      var offsetY = ((newHeight) - contHeight) / 2 - y;
      var offsetX = ((newWidth) - contWidth) / 2 - x;

      // animate to new position and size
      $(img).animate({
        width: contWidthScl,
        height: contWidthScl / imgRatio,
        top: -offsetY,
        left: -offsetX
      }, fade);
    } else {
      // image is thinner than container
      var newWidth = contHeightScl * imgRatio;
      var newHeight = contHeightScl;contHeightScl
      var offsetY = ((newHeight) - contHeight) / 2 - y;
      var offsetX = ((newWidth) - contWidth) / 2 - x;

      // animate to new position and size
      $(img).animate({
        width: contHeightScl * imgRatio,
        height: contHeightScl,
        top: -offsetY,
        left: -offsetX
      }, fade);
    }
  };

  // resize and position all portfolio images
  function sizeAll() {
    $('.work-item-pad img').each(function() {
      sizeWork($(this), 1, false);
    });
  };

  // event listener for portfolio items, sets desired scale
  $(".work-item-pad").hover(function() {
      //mouse in
      sizeWork($(this).find("img"), 1.1, true);
    }, function() {
      //mouse out
      sizeWork($(this).find("img"), 1, true);
  });

  // determine if container aspect ratios have changed
  // if so, resize all images
  $(window).resize(function() {
    setWorkRatio();
  });

  $(window).ready(function() {
    setWorkRatio();
  })
});

// ################################################
// initialize WOW package for scroll animations
// ################################################
new WOW().init();

// ################################################
// determine whether to show/hide the header
// modified from http://www.codrops.com
// ################################################
/**
 * cbpAnimatedHeader.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var cbpAnimatedHeader = (function() {

  var docElem = document.documentElement,
    header = document.querySelector( '.navbar-fixed-top' ),
    navCollapse = document.getElementById( 'bs-example-navbar-collapse-1'),
    navCollapseBtn = document.getElementById( 'btn-collapse'),
    didScroll = false,
    elemTop = $("#intro-thresh").offset().top;
    changeHeaderOn = elemTop;

  function init() {
    window.addEventListener( 'scroll', function( event ) {
      if( !didScroll ) {
        didScroll = true;
        setTimeout( scrollPage, 250 );
      }
    }, false );
  }

  function scrollPage() {
    var sy = scrollY();
    if ( sy >= changeHeaderOn ) {
      header.classList.remove('navbar-hidden');
    }
    else {
      header.classList.add('navbar-hidden');
      navCollapse.classList.remove('in');
      // navCollapse.classList.add('collapsing');
      // navCollapseBtn.classList.remove('collapsed');
    }
    didScroll = false;
  }

  function scrollY() {
    return window.pageYOffset || docElem.scrollTop;
  }

  init();

})()