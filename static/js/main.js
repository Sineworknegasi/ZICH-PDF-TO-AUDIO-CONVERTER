(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

    /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

})();

/**
* Upload file show file name
*/

$('.upload-btn').click(function(){
	document.querySelector('.file-input').click();
});

    $(document).on('change', '.file-input', function() {


  var filesCount = $(this)[0].files.length;

  var textbox = $(this).prev();

  if (filesCount === 1) {
    var fileName = $(this).val().split('\\').pop();
    textbox.text(fileName);
  } else {
    textbox.text('no file selected');
  }
});

/**
* Fader while loading file
*/
  var setCookie = function(name, value, expiracy) {
  var exdate = new Date();
  exdate.setTime(exdate.getTime() + expiracy * 1000);
  var c_value = escape(value) + ((expiracy == null) ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = name + "=" + c_value + '; path=/';
};

var getCookie = function(name) {
  var i, x, y, ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == name) {
      return y ? decodeURI(unescape(y.replace(/\+/g, ' '))) : y;
    }
  }
};

$('#downloadLink').click(function() {
  $('#fader').css('display', 'block');
  setCookie('downloadStarted', 0, 100);
  setTimeout(checkDownloadCookie, 500);
});
var downloadTimeout;
var checkDownloadCookie = function() {
  if (getCookie("downloadStarted") == 1) {
    setCookie("downloadStarted", "false", 100);
    $('#fader').css('display', 'none');
  } else {
    downloadTimeout = setTimeout(checkDownloadCookie, 1000);
  }
};

/**
* Checking file size to be less than 500 kB
*/
var uploadField = document.getElementById("file");

uploadField.onchange = function() {
    if(this.files[0].size > 524288){
       alert("File is too big! Please select a file with a maximum size of 500 kB.");
       this.value = "";
    };
};
