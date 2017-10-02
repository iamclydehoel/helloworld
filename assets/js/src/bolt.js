$(function() {

  function parameters(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
     return null;
    } else {
     return decodeURI(results[1]);
    }
  }

  function map(lat, long, zoom) {
		if (typeof google !== 'undefined') {
			var options = {
				zoom: zoom,
				center: new google.maps.LatLng(lat, long),
        disableDefaultUI: true,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        draggable: false,
				mapTypeId: google.maps.MapTypeId.SATELLITE
			};
			var map = new google.maps.Map(document.getElementById('map'), options);

      google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
      });
		}
	};

  function url(lat, long) {
    if (history.pushState) {
      var url = window.location.protocol + "//" + window.location.host + window.location.pathname + '?lat=' + lat + '&?long=' + long;
      window.history.pushState({path: url}, '', url);
    } else {
      window.location.href = '?lat=' + lat + '&?long=' + long;
    }
  }


  var lat, long, zoom,
      match = false;


  if ( parameters('lat') != null && parameters('long') != null ) {

    $('li').each(function() {

      if ( $(this).data('lat') == parameters('lat') && $(this).data('long') == parameters('long') ) {

        match = true;

        $(this).addClass('selected');

        if ( $(window).width() >= 1024 ) {
          $('aside .overflow-auto').animate({
            scrollTop: $(this).offset().top - ( $(window).height() - $(this).outerHeight() ) / 2
          }, 0);
        } else {
          $('aside .overflow-auto').animate({
            scrollLeft: $(this).offset().left - ( $(window).width() - $(this).outerWidth() ) / 2
          }, 0);
        }

      }

    });

    if ( match ) {
      console.log('Match');

      var selected = $('.selected');

      lat = selected.data('lat');
      long = selected.data('long');
      zoom = selected.data('zoom');

      map(lat, long, zoom);

    } else {
      console.log('No match');

      $('li:first-child').addClass('selected');
      var selected = $('.selected');

      lat = selected.data('lat');
      long = selected.data('long');
      zoom = selected.data('zoom');

      map(lat, long, zoom);

      url(lat, long);

    }

  } else {

    console.log('No parameters');

    $('li:first-child').addClass('selected');
    var selected = $('.selected');

    lat = selected.data('lat');
    long = selected.data('long');
    zoom = selected.data('zoom');

    map(lat, long, zoom);

    url(lat, long);

  }


	$('li').on('click', function() {

    if (!$(this).hasClass('selected')) {
      $(this).addClass('selected').siblings().removeClass('selected');
      var selected = $('.selected');

      lat = $('.selected').data('lat');
      long = $('.selected').data('long');
      zoom = $('.selected').data('zoom');

      map(lat, long, zoom);

      url(lat, long);

    }

	});

});
