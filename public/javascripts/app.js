var elevator;
var map;
var markers = [];
//var infowindow = new google.maps.InfoWindow();
//var denali = new google.maps.LatLng(34.041242, -118.254927);


var $lat = $("input.lat");
var $lng = $("input.lng");
var $alt = $("input.alt");

var $searchForm = $("#searchForm");

elevator = new google.maps.ElevationService();
function initialize() {
    var denali = new google.maps.LatLng(40.085632, -75.393583);
    var mapOptions = {
        zoom: 16,
        center: denali,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map($('#map-canvas')[0], mapOptions);
    google.maps.event.addListener(map, 'click', getElevation);

    $searchForm.ajaxForm({
        success: function (response, status) {
            deleteOverlays();
               //showEntities(rows);
            $.each(response,function(index, value){
                var entityLatlng = new google.maps.LatLng(value.latitude,value.longitude);
                var contentString = '<p><h2>'+value.name+'</h2><br /><b>Address</b>:'+value.address+
                    '<br /><b>Tel</b>:'+value.telphone
                var title = value.name;
                addMarker(entityLatlng, contentString, title);
            })
            setAllMap(map);
        }
    });
}

// Add a marker to map and push to the array.
function addMarker(location, contentString, title){
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: title
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
    });
    markers.push(marker);
}

// Set the map on all markers in the array.
function setAllMap(map) {
    for (var i =0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Remove the overlays from the map, but keeps them in the array.
function clearOverLays(){
    setAllMap(null);
}

// Shows any overlays currently in the array.
function showOverlays(){
    setAllMap(map);
}
// Delete all markers in the array by removing references to them.
function deleteOverlays() {
    clearOverLays();
    markers = [];
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

