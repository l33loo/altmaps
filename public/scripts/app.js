
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

  function editButtonHandler(index){
    return function(event){

      event.preventDefault();

      // this is the text fields, siblings to the submit button in DOM.
      var $inputs = $(this).siblings();

      // basic check to make sure values aren't empty.
      if($inputs[0].value && $inputs[1].value){
        putPin(currentMap.markers[index], $inputs[0].value, $inputs[1].value)
      }

    }
  }

  function createPlaceListItem(title, description, placeId, index){

    var $item = $('<div id="list-' + placeId + '" class="item">');
    var $icon = $('<i class="map marker icon">').appendTo($item);
    var $content = $('<div class="content">').appendTo($item);
    var $header = $('<div class="header">').appendTo($content);
    var $title = $('<a>').text(title).appendTo($header);
    var $edit = $('<i class="edit icon">').appendTo($header);
    var $description = $('<div class="description">').text(description).appendTo($content);

    $title.on('click', function(){

      google.maps.event.trigger(currentMap.markers[index], 'click');

    });

    $edit.on('click', function(){
      //edit place by replacing listing with form.

      var $newContent = $('<div class="content">');
      var $form = $('<form class="ui form">').appendTo($newContent);
      var $formTitle = $('<input type="text" name="title" placeholder="Pin Title">').val($title.text()).appendTo($form);
      var $formDescription = $('<input type="text" name="description" placeholder="Description">').val($description.text()).appendTo($form);
      var $formEdit = $('<button class="ui button" type="submit">Edit</button>').appendTo($form);

      $formEdit.on('click', editButtonHandler(index));

      $content.replaceWith($newContent);
    });

    return $item;
  }

  function populatePlaceList(places, $elm){

    var $newList = $('<div id="pins-list" class="ui list">');

    places.forEach(function(place, index){
      createPlaceListItem(place.title, place.description, place.id, index).appendTo($newList);
    });

    $elm.replaceWith($newList);

  }

  function getMapId(){
    var pathname = window.location.pathname;
    var regex = /maps\/(\d+)\/?\b/;
    var mapId = regex.exec(pathname);
    return mapId[1];
  }

  // adds a blank form to the top of the markers list and returns the jQuery object referencing the form.
  function addMarkerFormToList($list){

    var $item = $('<div class="item">');
    var $icon = $('<i class="map marker icon">').appendTo($item);
    var $content = $('<div class="content">').appendTo($item);
    var $form = $('<form class="ui form">').appendTo($content);
    var $title = $('<input type="text" name="title" placeholder="Pin Title">').appendTo($form);
    var $description = $('<input type="text" name="description" placeholder="Description">').appendTo($form);
    var $add = $('<button class="ui button" type="submit">Add</button>').appendTo($form);

    $item.prependTo($list);
    $title.focus();

    return $form;

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
        // newMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        newMarker.placeId = pin.id;


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
            '<div>Last edited by <a href="/users/' + pin.created_by + '">' + pin.username + '</a></div>' +
            '<div>on ' + pin.updated_at.slice(0, 10) + '</div>' +
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
          console.dir(newMarker);

          // highlight corresponding entry in list
          $("#pins-list").children().removeClass("highlight");
          $("#list-" + newMarker.placeId).addClass("highlight");
          currentMap.infoWindow.close();
          // newMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
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

  function postPin(pin, title, description) {

      var data = {

        latitude: pin.position.lat(),
        longitude: pin.position.lng(),
        title: title,
        description: description

      };
      // console.log('data: ', data);
      $.post("/maps/" + currentMap.mapId, data).done(function() {

        getPins();
      });
  }

  function putPin(pin, title, description) {
    console.dir(pin);
      var data = {

        latitude: pin.position.lat(),
        longitude: pin.position.lng(),
        title: title,
        description: description

      };
      console.log('data: ', data);
      $.ajax({
          method: "PUT",
          url: "/maps/" + $(this).data("map-id") + "/" + pin.placeId
        }).done( function() {
          getPins()
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

  currentMap.markers.forEach(function(marker){
    if(marker.placeId === 9){
      $(marker).click();
    }
  })

  google.maps.event.addListener(currentMap.map, 'click', function(event) {
    // console.log('map clicked');
    // console.log(event.latLng);
    var marker = new google.maps.Marker({
      position: event.latLng,
      title: 'foo',
      draggable: true,
      map: currentMap.map
    });
    marker.setMap(currentMap.map);

    // add blank form and store as jQuery object.
    var $form = addMarkerFormToList($('#pins-list'));

    // set listener for submit button.
    $form.children("button").on('click', function(event){

      event.preventDefault();

      // this is the text fields, siblings to the submit button in DOM.
      var $inputs = $(this).siblings();

      // basic check to make sure values aren't empty.
      if($inputs[0].value && $inputs[1].value){
        postPin(marker, $inputs[0].value, $inputs[1].value)
      }

    });
  });
}
