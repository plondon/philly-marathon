import React from 'react';
import {render} from 'react-dom';

class RunList extends React.Component {
  render () {
    return (
      <ol>
        {this.props.runs.map((run) => {
          return <li key={run.id}>
                    <a data-start={run.start_latlng}
                       data-polyline={run.map.summary_polyline}>
                      {run.name}
                    </a>
                  </li>
        })}
      </ol>
    )
  }
}

var myLatlng = new google.maps.LatLng(40, -74);
var map = new google.maps.Map(document.getElementById('map'), {center: myLatlng});

$.get('/runs', function (runs) {
  render(<RunList runs={runs}/>, document.getElementById('runs'))
});

$('#runs').on('click', 'a', function (e) {
  e.preventDefault();
  $('#map').addClass('active');

  var polyline = $(e.currentTarget).data('polyline');
  var startLatLng = $(e.currentTarget).data('start').split(',');

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
