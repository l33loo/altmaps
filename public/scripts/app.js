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
  currentMap.map = new google.maps.Map($('#map')[0], {
    zoom: 12,
    center: {lat: currentMap.pins[0].lat, lng: currentMap.pins[0].lng},
    styles: currentMap.styles
  });

  currentMap.infoWindow = new google.maps.InfoWindow();
  currentMap.markers = [];
  currentMap.pins.forEach(function(pin){
    var newMarker = new google.maps.Marker({
      position: {lat: pin.lat, lng: pin.lng},
      title: pin.title,
      map: currentMap.map
    });

    google.maps.event.addListener(newMarker, 'click', function() {
      currentMap.infoWindow.close();
      currentMap.infoWindow.setContent(pin.description);
      currentMap.infoWindow.open(currentMap.map, newMarker);
    });

    currentMap.markers.push(newMarker);
  });

  console.dir(currentMap.markers);
}




$(document).ready(function(){
  console.log("Hello from jQuery");



});
