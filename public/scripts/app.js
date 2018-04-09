
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

// constructs a function to allow reference to key in currentMap.markers object.
// bound to on click for edit button in pins list.
  function editButtonHandler(placeId){
    return function(event){

      event.preventDefault();

      // this is the text fields, siblings to the submit button in DOM.
      var $inputs = $(this).siblings();

      // basic check to make sure values aren't empty.
      if($inputs[0].value && $inputs[1].value){
        putPin(currentMap.markers[placeId], $inputs[0].value, $inputs[1].value)
      }

    }
  }


  function createPlaceListItem(title, description, placeId){

    var $item = $('<div id="list-' + placeId + '" class="item">');
    var $icon = $('<i class="map marker icon">').appendTo($item);
    var $content = $('<div class="content">').appendTo($item);
    var $header = $('<div class="header">').appendTo($content);
    var $title = $('<a>').text(title).appendTo($header);
    var $edit = $('<i class="edit icon">').appendTo($header);
    var $delete = $('<i class="delete icon">').appendTo($header);
    var $description = $('<div class="description">').text(description).appendTo($content);

    $title.on('click', function(){

      google.maps.event.trigger(currentMap.markers[placeId], 'click');

    });

    $edit.on('click', function(){
      //edit place by replacing listing with form.

      var $newContent = $('<div class="content">');
      var $form = $('<form class="ui form">').appendTo($newContent);
      var $formTitle = $('<input type="text" name="title" placeholder="Pin Title">').val($title.text()).appendTo($form);
      var $formDescription = $('<input type="text" name="description" placeholder="Description">').val($description.text()).appendTo($form);
      var $formEdit = $('<button class="ui button" type="submit">Edit</button>').appendTo($form);

      $formEdit.on('click', editButtonHandler(placeId));

      $content.replaceWith($newContent);
    });

    $delete.on('click', function(){
      // replace description with "are you sure" double check
      var $newDescription = $('<div class="description">');
      var $deleteButton = $('<button class="ui button">Yes, delete it!</button>').appendTo($newDescription);
      var $cancelButton = $('<button class="ui button">No, no, keep it!</button>').appendTo($newDescription);
      $description.replaceWith($newDescription);

      $deleteButton.on('click', function(event){
        event.preventDefault();
        deletePin(currentMap.markers[placeId]);
      })

      $cancelButton.on('click', function(event){
        event.preventDefault();
        $newDescription.replaceWith($description);
      });

    });

    return $item;
  }

  function populatePlaceList(places, $elm){

    var $newList = $('<div id="pins-list" class="ui list">');

    places.forEach(function(place){
      createPlaceListItem(place.title, place.description, place.id).appendTo($newList);
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
    // remove any previous markers
    if("markers" in currentMap){
      for(marker in currentMap.markers){
        currentMap.markers[marker].setMap(null);
      }
      delete currentMap.markers;
    }

    // add new blank markers object
    currentMap.markers = {};

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

        var pinInfo = '<div id="infoWin">' +
            '<b>' + pin.title + '</b>' +
            '<div>' + pin.description + '</div>' +
            '<div>lat: ' + pin.latitude + '</div>' +
            '<div>long: ' + pin.longitude + '</div>' +
            '<div>Last edited by <a href="/users/' + pin.created_by + '">' + pin.username + '</a></div>' +
            '<div>on ' + pin.updated_at.slice(0, 10) + '</div>' +
            '</div>';

        google.maps.event.addListener(newMarker, 'click', function() {

          // highlight corresponding entry in list
          $("#pins-list").children().removeClass("highlight");
          $("#list-" + newMarker.placeId).addClass("highlight");
          currentMap.infoWindow.close();
          currentMap.infoWindow.setContent(pinInfo);
          currentMap.infoWindow.open(currentMap.map, newMarker);
        });

        currentMap.markers[newMarker.placeId] = newMarker;
      });

      populatePlaceList(currentMap.pins, $('#pins-list'));

      currentMap.map.fitBounds(returnBounds());

    })
    .catch(function(err){
      console.log("Error getting pins", err);
    });
  }

  // used for adding new pins
  function postPin(pin, title, description) {

      var data = {

        latitude: pin.position.lat(),
        longitude: pin.position.lng(),
        title: title,
        description: description

      };
      $.post("/maps/" + currentMap.mapId, data).done(function() {
        getPins();
      });
  }

  // used for editing pins
  function putPin(pin, title, description) {
      var data = {

        latitude: pin.position.lat(),
        longitude: pin.position.lng(),
        title: title,
        description: description

      };

      $.ajax({
          method: "PUT",
          url: "/maps/" + currentMap.mapId + "/" + pin.placeId,
          data: data
        }).done( function() {
          getPins()
        });
  }

  function deletePin(pin){
    $.ajax({
        method: "DELETE",
        url: "/maps/" + currentMap.mapId + "/" + pin.placeId
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


  getPins();

  // currentMap.markers.forEach(function(marker){
  //   if(marker.placeId === 9){
  //     $(marker).click();
  //   }
  // })

  google.maps.event.addListener(currentMap.map, 'click', function(event) {
    var marker = new google.maps.Marker({
      position: event.latLng,
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
