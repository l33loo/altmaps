// require('dotenv').config();
// const knex        = require("knex")(knexConfig[ENV]);
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

// currentMap.pins = [{lat: 48.4064791, lng: -123.3735108, title: "I am a beach", description: "This is the first place I clicked", createdBy: "Andrew"},
// {lat: 48.4335921, lng: -123.3123138, title: "Willows Beach", description: "Awesome swimming!!1", createdBy: "Andrew"},
// {lat: 48.463765, lng: -123.280170, title: "Telegraph Cove", description: "So romantic! Awww", createdBy: "Andrew"},
// {lat: 48.4555994, lng: -123.350961, title: "Water Feature", description: "Surprise, it's not actually a beach! Do not swim in the water features!", createdBy: "Andrew"},
// {lat: 48.4465182, lng: -123.4077808, title: "That Beach on The Gorge", description: "Secluded Solitude, rewards await the adventurous swimmer", createdBy: "Andrew"}];


// callback function called by maps API on map load.
initMap = function() {

  function returnBounds(){
    // sw is minimum longitude, minimum latitude
    var bounds = {east: currentMap.pins[0].longitude, north: currentMap.pins[0].latitude, south: currentMap.pins[0].latitude, west: currentMap.pins[0].longitude};

    currentMap.pins.forEach(function(pin){
      if(pin.latitude < bounds.south){
        bounds.south = pin.latitude;
      }
      if(pin.longitude > bounds.east){
        bounds.east = pin.longitude;
      }
      if(pin.latitude > bounds.north){
        bounds.north = pin.latitude;
      }
      if(pin.longitude < bounds.west){
        bounds.west = pin.longitude;
      }

    });
    return bounds;
  }

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
    });

  }

  function getMapId(){
    var pathname = window.location.pathname;
    var regex = /maps\/(\d+)\/?\b/;
    var mapId = regex.exec(pathname);
    return mapId[1];
  }

  function getPins(){
    $.getJSON("/maps/" + currentMap.mapId + "/json").then(function(pins){
      currentMap.pins = pins;
      currentMap.pins.forEach(function(pin){
        // convert coordinates to numbers.
        pin.latitude = Number(pin.latitude);
        pin.longitude = Number(pin.longitude);
        var newMarker = new google.maps.Marker({
          position: {lat: pin.latitude, lng: pin.longitude},
          title: pin.title,
          draggable: true,
          map: currentMap.map
        });



        // var pinInfoUser = '<div id="infoWin">' +
        //     '<form action="/maps/' + currentMap.map + '" method="POST"'> +
        //       '<input type="text" value=' + pin.title + '>' +
        //       '<input type="text" value=' + pin.description + '>' +
        //       '<div>lat: ' + pin.latitude + ', long: ' + pin.longitude + '</div>' +
        //       '<input type="submit" value="Edit">' +
        //     // '<div>Created by <a href="/users/:userID">' + USER + '</a></div>' +
        //       '<div>Created by <a href="/users/1">1</a></div>' +
        //     '</form>' +
        //     '<form action="/maps/' + currentMap.map + '" method="DELETE"'>'<input type="submit" value="Delete"></form>' +
        //     '</div>';

        var pinInfo = '<div id="infoWin">' +
            '<b>' + pin.title + '</b>' +
            '<div>' + pin.description + '</div>' +
            '<div>lat: ' + pin.latitude + '</div>' +
            '<div>long: ' + pin.longitude + '</div>' +
            // '<div>Created by<a href="/users/:userID">' + USER + '</a></div>'
            '<div>Created by <a href="/users/1">1</a></div>' +
            '</div>';

        // var newPinInfo = '<b>new</b>';

        // var newPinInfo = '<div id="infoWin">' +
        //     '<form action="/maps/' + currentMap.map + '" method="PUT"'> +
        //       '<input type="text" value=' + pin.title + '>' +
        //       '<input type="text" value=' + pin.description + '>' +
        //       '<div>lat: ' + pin.latitude + ', long: ' + pin.longitude + '</div>' +
        //       '<input type="submit" value="Edit">' +
        //     // '<div>Created by <a href="/users/:userID">' + USER + '</a></div>' +
        //       '<div>Created by <a href="/users/1">1</a></div>' +
        //     '</form>' +
        //     '<form action="/maps/' + currentMap.map + '" method="DELETE"'>'<input type="submit" value="Delete"></form>' +
        //     '</div>';

        google.maps.event.addListener(newMarker, 'click', function() {
          currentMap.infoWindow.close();
          // if (pin is new) {
            // currentMap.infoWindow.setContent(newPinInfo);
          // } else if (user logged in and owns pin) {
            // currentMap.infoWindow.setContent(pinInfoUser);
          // } else {
            currentMap.infoWindow.setContent(pinInfo);
          // }
          currentMap.infoWindow.open(currentMap.map, newMarker);
        });

        currentMap.markers.push(newMarker);
      });

      populatePlaceList(currentMap.pins, $('#pins-list'));

      currentMap.map.fitBounds(returnBounds());

    })
    .catch(function(err){
      console.log("Error getting pins", err);
    });
  }

  function postPin(pin) {
    // $(pin).on('submit', function(event) {
      // event.preventDefault();
      var data = {
        created_by: 1,
        map_id: currentMap.mapId,

        // Or {latitude: req.body.lat},?
        latitude: pin.position.lat(),
        longitude: pin.position.lng(),

        // Or {title: $(req.body.title).serialize()},?
        title: pin.title /*$(this.title).serialize()*/,

        // Or {title: $(req.body.description).serialize()},?
        description: 'boo' /*$(this.description).serialize()*/

        // {category: req.body.category}?
        // color:
      };
      console.log('data: ', data);
      $.post("/maps/" + currentMap.mapId, data).done(function() {

        getPins();
      // });
    });
  }

  currentMap.mapId = getMapId();

  currentMap.map = new google.maps.Map($('#map')[0], {
    zoom: 12,
    center: {lat: 48.4335921, lng: -123.3123138},
    styles: currentMap.styles
  });

  currentMap.infoWindow = new google.maps.InfoWindow();
  currentMap.markers = [];

  getPins();

  google.maps.event.addListener(currentMap.map, 'click', function(event) {
    // console.log('map clicked');
    console.log(event.latLng);
    var marker = new google.maps.Marker({
      position: event.latLng,
      title: 'foo',
      draggable: true,
      map: currentMap.map
    });
    marker.setMap(currentMap.map);
    // console.log(event.latLng);
    postPin(marker);
  });
}
