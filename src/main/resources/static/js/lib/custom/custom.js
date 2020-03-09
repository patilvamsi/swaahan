/*---- Fixed nav top ----*/
$(document).ready(function () {
	 if ($('.main-nav-sctn').length) {
		var navpos = $('.main-nav-sctn').offset();
		console.log(navpos.top);
		$(window).bind('scroll', function () {
			if ($(window).scrollTop() > navpos.top) {
				$('.main-nav-sctn').addClass('navbar-fixed-top');
				$('.main-nav-sctn').addClass('navbar-top-box-shadow');
				
			}
			else {
				$('.main-nav-sctn').removeClass('navbar-fixed-top');
				$('.main-nav-sctn').removeClass('navbar-top-box-shadow');
				
			}
		});
	 }
});

$('.eventsTab').on('toggled', function (event, tab) {
	alert(tab);
	$('.manualinitializeslicker').slick('setPosition',0);
});

/*---- Nav style ----*/
$(".navbar-nav").hover(function(){ 
	$(".navbar-nav").toggleClass("active");
});

/****** Get Location from Google Maps  ******/
geolocator.config({
    language: "en",
    google: {
        version: "3",
        key: "AIzaSyCtm0WRTtE6xVAa9Cl2LfvbmonEPhQyEBI"
    }
});

/*window.onload = function () {
    var options = {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumWait: 10000,     // max wait time for desired accuracy
        maximumAge: 0,          // disable cache
        desiredAccuracy: 30,    // meters
        fallbackToIP: true,     // fallback to IP if Geolocation fails or rejected
        addressLookup: true,    // requires Google API key if true
        timezone: true,         // requires Google API key if true
//        map: "map-canvas",      // interactive map element id (or options object)
        staticMap: false         // map image URL (boolean or options object)
    };
    geolocator.locate(options, function (err, location) {
        if (err) return console.log(err);
        console.log(location);
    });
};*/

/*---- Header Location ----*/
$(".evf-location").click(function(){ 
	$(".evf-location").toggleClass("active");
});


/*---- Deals Blinker ----*/
$(function(){
	(function blink() { 
	  $('.deals-nav').fadeOut(600).fadeIn(600, blink); 
	})();
});

/*---- Slider Script ----*/
$(document).ready(function() {
    $('.promo-left').slick({
        dots: true,
		autoplay: true,
        infinite: true,
        speed: 1500,
        slidesToShow: 1,
        slidesToScroll: 1
    });
	$('.promo-right').slick({
        dots: true,
		infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    });
	/*$('.review-wdgt').slick({
	  dots: false,
	  infinite: true,
	  speed: 300,
	  slidesToShow: 3,
	  slidesToScroll: 1,
	  responsive: [
		{
		  breakpoint: 1024,
		  settings: {
			slidesToShow: 3,
			slidesToScroll: 1,
			infinite: true,
			dots: false
		  }
		},
		{
		  breakpoint: 769,
		  settings: {
			slidesToShow: 2,
			slidesToScroll: 1
		  }
		},
		{
		  breakpoint: 601,
		  settings: {
			slidesToShow: 1,
			slidesToScroll: 1
		  }
		},
	]
	});*/
	$('.partner-wdgt').slick({
	  dots: true,
	  autoplay: true,
	  infinite: true,
	  speed: 300,
	  slidesToShow: 5,
	  slidesToScroll: 1,
	  responsive: [
		{
		  breakpoint: 1024,
		  settings: {
			slidesToShow: 4,
			slidesToScroll: 1,
			infinite: true,
			dots: false
		  }
		},
		{
		  breakpoint: 769,
		  settings: {
			slidesToShow: 3,
			slidesToScroll: 1
		  }
		},
		{
		  breakpoint: 601,
		  settings: {
			slidesToShow: 2,
			slidesToScroll: 1
		  }
		},
		{
		  breakpoint: 480,
		  settings: {
			slidesToShow: 1,
			slidesToScroll: 1
		  }
		}
	]
	});
	
	$('.multi-item-carousel').carousel({
		  interval: 1000
		});

		// for every slide in carousel, copy the next slide's item in the slide.
		// Do the same for the next, next item.
		$('.multi-item-carousel .item').each(function(){
		  var next = $(this).next();
		  if (!next.length) {
		    next = $(this).siblings(':first');
		  }
		  next.children(':first-child').clone().appendTo($(this));
		  
		  if (next.next().length>0) {
		    next.next().children(':first-child').clone().appendTo($(this));
		  } else {
		  	$(this).siblings(':first').children(':first-child').clone().appendTo($(this));
		  }
		});
});

/*---- Restaurant Profile Page Tab ----*/
$(document).ready(function () {
	$('#horizontalTab').easyResponsiveTabs({
		type: 'default', //Types: default, vertical, accordion           
		width: 'auto', //auto or any width like 600px
		fit: true   // 100% fit in a container
	});
});

/*---- Header Location ----*/
function toggleChevron(e) {
    $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('fa-plus-square-o fa-minus-square-o');
}
$('#accordion').on('hidden.bs.collapse', toggleChevron);
$('#accordion').on('shown.bs.collapse', toggleChevron);
$('#accordion1').on('hidden.bs.collapse', toggleChevron);
$('#accordion1').on('shown.bs.collapse', toggleChevron);


/*---- Phogo Gallery Script ----*/
$(function () {
    var $gallery = $('.photo-gallery-wdgt a').simpleLightbox();

    $gallery.on('show.simplelightbox', function () {
        console.log('Requested for showing');
    })
            .on('shown.simplelightbox', function () {
                console.log('Shown');
            })
            .on('close.simplelightbox', function () {
                console.log('Requested for closing');
            })
            .on('closed.simplelightbox', function () {
                console.log('Closed');
            })
            .on('change.simplelightbox', function () {
                console.log('Requested for change');
            })
            .on('next.simplelightbox', function () {
                console.log('Requested for next');
            })
            .on('prev.simplelightbox', function () {
                console.log('Requested for prev');
            })
            .on('nextImageLoaded.simplelightbox', function () {
                console.log('Next image loaded');
            })
            .on('prevImageLoaded.simplelightbox', function () {
                console.log('Prev image loaded');
            })
            .on('changed.simplelightbox', function () {
                console.log('Image changed');
            })
            .on('nextDone.simplelightbox', function () {
                console.log('Image changed to next');
            })
            .on('prevDone.simplelightbox', function () {
                console.log('Image changed to prev');
            })
            .on('error.simplelightbox', function (e) {
                console.log('No image found, go to the next/prev');
                console.log(e);
            });
});

/*---- Show More & Less Script ----*/
$(window).load(function(){
	try{
		var text = $('.text-overflow'),
	     btn = $('.btn-overflow'),
	       h = text[0].scrollHeight;
	}catch(e){
		
	}
 

if(h > 70) {
	btn.addClass('less');
	btn.css('display', 'block');
}

btn.click(function(e) 
{
  e.stopPropagation();

  if (btn.hasClass('less')) {
      btn.removeClass('less');
      btn.addClass('more');
      btn.text('<<less');

      text.animate({'height': h});
  } else {
      btn.addClass('less');
      btn.removeClass('more');
      btn.text('more>>');
      text.animate({'height': '70px'});
  }  
});
});