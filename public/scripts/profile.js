$(document).ready(function() {

  function getUserId() {
    var pathname = window.location.pathname;
    var regex = /users\/(\d+)\/?\b/;
    var userId = regex.exec(pathname);
    return userId[1];
  }

  var profileUserId = getUserId();

  function createMapsListItem(title, description, id) {
    var $item = $('<div class="item">');
    var $icon = $('<i class="map marker icon">').appendTo($item);
    var $content = $('<div class="content">').appendTo($item);
    var $title = $('<a class="header" href="/maps/' + id + '">').text(title).appendTo($content);
    var $description = $('<div class="description">').text(description).appendTo($content);

    return $item;
  }

  function populateMapList(maps, $parent) {
    maps.forEach(function(map) {
      createMapsListItem(map.title, map.description, map.map_id).appendTo($parent);
    });
  }

  function getFavs() {
    $.getJSON("/users/" + profileUserId + "/fav/json").then(function(maps) {
      populateMapList(maps, $('#fav'));
    })
    .catch(function(err) {
      console.log("Error getting favorite maps", err);
    });
  }

  function getContrib() {
    $.getJSON("/users/" + profileUserId + "/contrib/json").then(function(maps) {
      populateMapList(maps, $('#contrib'));
    })
    .catch(function(err) {
      console.log("Error getting maps", err);
    });
  }

  getFavs();

  getContrib();

});
