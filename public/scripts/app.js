// We don't want this for now.

// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });

var currentMap = {};

currentMap.styles = [
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  }
];

currentMap.pins = [{lat: 48.4064791, lng: -123.3735108, title: "I am a beach", description: "This is the first place I clicked", createdBy: "Andrew"},
{lat: 48.4335921, lng: -123.3123138, title: "Willows Beach", description: "Awesome swimming!!1", createdBy: "Andrew"},
{lat: 48.463765, lng: -123.280170, title: "Telegraph Cove", description: "So romantic! Awww", createdBy: "Andrew"},
{lat: 48.4555994, lng: -123.350961, title: "Water Feature", description: "Surprise, it's not actually a beach! Do not swim in the water features!", createdBy: "Andrew"},
{lat: 48.4465182, lng: -123.4077808, title: "That Beach on The Gorge", description: "Secluded Solitude, rewards await the adventurous swimmer", createdBy: "Andrew"}];


// callback function called by maps API on map load.
initMap = function() {

  function returnBounds(){
    // sw is minimum longitude, minimum latitude
    var bounds = {east: currentMap.pins[0].lng, north: currentMap.pins[0].lat, south: currentMap.pins[0].lat, west: currentMap.pins[0].lng};

    currentMap.pins.forEach(function(pin){
      if(pin.lat < bounds.south){
        bounds.south = pin.lat;
      }
      if(pin.lng > bounds.east){
        bounds.east = pin.lng;
      }
      if(pin.lat > bounds.north){
        bounds.north = pin.lat;
      }
      if(pin.lng < bounds.west){
        bounds.west = pin.lng;
      }

    });
    return bounds;
  }


  currentMap.map = new google.maps.Map($('#map')[0], {
    zoom: 12,
    center: {lat: currentMap.pins[0].lat, lng: currentMap.pins[0].lng},
    styles: currentMap.styles
  });

  console.dir(returnBounds());
  currentMap.map.fitBounds(returnBounds());

  currentMap.infoWindow = new google.maps.InfoWindow();
  currentMap.markers = [];
  currentMap.pins.forEach(function(pin){
    var newMarker = new google.maps.Marker({
      position: {lat: pin.lat, lng: pin.lng},
      title: pin.title,
      draggable: true,
      map: currentMap.map
    });

    google.maps.event.addListener(newMarker, 'click', function() {
      currentMap.infoWindow.close();
      currentMap.infoWindow.setContent(pin.description);
      currentMap.infoWindow.open(currentMap.map, newMarker);
    });

    currentMap.markers.push(newMarker);
  });

}




$(document).ready(function(){

  function createPlaceListItem(title, description){
    var $item = $('<div class="item">');
    var $icon = $('<i class="map marker icon">').appendTo($item);
    var $content = $('<div class="content">').appendTo($item);
    var $title = $('<a class="header">').text(title).appendTo($content);
    var $description = $('<div class="description">').text(description).appendTo($content);

    return $item;
  }

  function populatePlaceList(places, $parent){

    places.forEach(function(place){
      createPlaceListItem(place.title, place.description).appendTo($parent);
      console.log("adding place " + place.title);
    });

  }

  populatePlaceList(currentMap.pins, $('#pins-list'));

});
