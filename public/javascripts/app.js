var elevator;
var map;
//var infowindow = new google.maps.InfoWindow();
//var denali = new google.maps.LatLng(34.041242, -118.254927);
var denali = new google.maps.LatLng(40.085632, -75.393583);


var $lat = $("input.lat");
var $lng = $("input.lng");
var $alt = $("input.alt");

var $searchForm = $("#searchForm");

function initialize() {
  var mapOptions = {
    zoom: 16,
    center: denali,
    mapTypeId: 'terrain'
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  elevator = new google.maps.ElevationService();
  google.maps.event.addListener(map, 'click', getElevation);


  $searchForm.ajaxForm({
    success: function (rows) {
               console.log(rows);
               //showEntities(rows);
             }
  });
}

function getElevation(event) {

  var locations = [];
  var point = event.latLng;

  var clickedLocation = point;
  $lat.val(point.lb);
  $lng.val(point.mb);

  locations.push(clickedLocation);

  var positionalRequest = {
    'locations': locations
  }

  elevator.getElevationForLocations(positionalRequest, function(results, status) {
    if (status == google.maps.ElevationStatus.OK) {

      if (results[0]) {
        $alt.val(results[0].elevation);
        //infowindow.setContent('The elevation at this point <br>is ' + results[0].elevation + ' meters.');
        //infowindow.setPosition(clickedLocation);
        //infowindow.open(map);
      } else {
        alert('No results found');
      }
    } else {
      alert('Elevation service failed due to: ' + status);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

