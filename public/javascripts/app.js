var elevator;
var map;
var markers = [];
//var infowindow = new google.maps.InfoWindow();
//var denali = new google.maps.LatLng(34.041242, -118.254927);


var $lat = $("input.lat");
var $lng = $("input.lng");
var $ele = $("input.ele");
var $alt = $("input.alt");
var $rad = $("input.rad");

var $searchForm = $("#searchForm");
var $submit = $searchForm.find(".submitBtn");

elevator = new google.maps.ElevationService();
function initialize() {
    var denali = new google.maps.LatLng(40.085632, -75.393583);
    var mapOptions = {
        zoom: 16,
        center: denali,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map($('#map-canvas')[0], mapOptions);
    google.maps.event.addListener(map, 'click', getElevation);

    $searchForm.ajaxForm({
        success: function (response, status) {
            showEntities(response);
        }
    });

    $submit.click(function (e) {
      $submit.addClass("disabled");
    });
}

// Add a marker to map and push to the array.
function addMarker(location, title){
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: title
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

// Delete all markers in the array by removing references to them.
function deleteOverlays() {
    clearOverLays();
    markers = [];
}

function showEntities(rows) {
  rows = reSort(rows);
  showCount(rows.length);
  showList(rows);
  showMap(rows);
  $submit.removeClass("disabled");
}

function reSort(rows) {
  var ele = parseFloat($ele.val() || 0);
  var alt = parseFloat($alt.val() || ele);
  var rad = parseFloat($rad.val() || 200);
  rows.forEach(function (r, i) {
    r.altitude = getAltitude(r, ele);
    r.d = Math.pow(Math.pow(r.altitude-alt, 2) + Math.pow(r["$distance"], 2), 0.5);
  });

  rows = rows.filter(function (r) {
    return r.d < rad;
  });

  rows.sort(function (a, b) {
    return a.d - b.d;
  });
  return rows;
}

var multipler = 4;
function getAltitude(r, ele) {
  if (!r.address_extended) return ele;
  var num = r.address_extended.match(/(ste|fl|\#)\s+(\d+)/i);
  if (num) {
    if (num[2].length < 3) return ele;
    return parseInt(num[2].slice(0, -2)) * multipler + ele;
  }
  return ele;
}


$count = $("#entityList .count");
function showCount(l) {
  $count.html(l);
}

var listTemplate = $("#liTempl").html();
var $list = $("#entityList tbody");
function showList(rows) {
  $list.html('');
  rows.forEach(function(r, idx) {
    var $l = $(listTemplate);
    $l.find(".name").html(r.name);
    $l.find(".lat").html(r.latitude);
    $l.find(".lng").html(r.longitude);
    $l.find(".addExt").html(r.address_extended);
    $l.find(".alt").html(r.altitude);
    $l.find(".distance").html(r['$distance']);
    $l.find(".geoDistance").html(r.d);

    $list.append($l);
  });
}

function showMap(rows) {
    deleteOverlays();
    $.each(rows,function(index, value){
        var entityLatlng = new google.maps.LatLng(value.latitude,value.longitude);
        var title = value.name;
        addMarker(entityLatlng, title);
    })
    setAllMap(map);
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
        $ele.val(results[0].elevation);
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

