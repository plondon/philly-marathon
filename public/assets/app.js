var $ul = $('#runs');
var myLatlng = new google.maps.LatLng(40, -74);
var map = new google.maps.Map(document.getElementById('map'), {center: myLatlng});

$.get('/runs', function (runs) {
  runs.forEach(function (run) {
    var $li = $('<li>');
    var $a = $('<a target="_blank">');
    var link = 'https://www.strava.com/activities/';

    $a.html(run.name);
    $a.attr('href', link + run.id)
      .data('start', run.start_latlng)
      .data('polyline', run.map.summary_polyline);

    $ul.append($li.append($a));
  });
});

$('#runs').on('click', 'a', function (e) {
  e.preventDefault();
  $('#map').addClass('active');

  var polyline = $(e.currentTarget).data('polyline');
  var startLatLng = $(e.currentTarget).data('start');

  var myLatlng = new google.maps.LatLng(startLatLng[0], startLatLng[1]);

  var myOptions = {
    zoom: 13,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById('map'), myOptions);

  var decodedPath = google.maps.geometry.encoding.decodePath(polyline);
  var decodedLevels = decodeLevels('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');

  new google.maps.Polyline({
    path: decodedPath,
    levels: decodedLevels,
    strokeColor: '#4285F4',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    map: map
  });

  function decodeLevels (encodedLevelsString) {
    var decodedLevels = [];

    for (var i = 0; i < encodedLevelsString.length; ++i) {
      var level = encodedLevelsString.charCodeAt(i) - 63;
      decodedLevels.push(level);
    }
    return decodedLevels;
  }
});
