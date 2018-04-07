$(document).ready(function(){

  function createMapCard(title, created_by, updated_at, description){
    var $card = $('<div class="card">');
    $('<div class="image"><img src="/images/map_placeholder.jpg"></div>').appendTo($card);
    var $content = $('<div class="content">').appendTo($card);
    var $title = $('<div class="header">').text(title).appendTo($content);
    var $description = $('<div class="description">').text(description).appendTo($content);

    var $extraContent = $('<div class="extra content">').appendTo($card);
    var $rightFooter = $('<span class="right floated">').text(updated_at).appendTo($extraContent);
    var $leftFooter = $('<span>').text("75 Contributors").appendTo($extraContent);
    var $icon = $('<i class="user icon"></i>').insertBefore($leftFooter);


    return $card;

      //<div class="card">
      // <div class="image">
      //   <img src="/images/map_placeholder.jpg">
      // </div>
      // <div class="content">
      //   <div class="header">I'm a cool map</div>
      //   <div class="meta">
      //     <a>Friends</a>
      //   </div>
      //   <div class="description">
      //     This is a map of the coolest things.
      //   </div>
      // </div>
      // <div class="extra content">
      //   <span class="right floated">
      //     Created today!
      //   </span>
      //   <span>
      //     <i class="user icon"></i>
      //     75 Contributors
      //   </span>
      // </div>
      //</div>
  }

  function populateMapList(maps, $parent){
    console.dir(maps);
    maps.forEach(function(map){
      createMapCard(map.title, map.created_by, map.updated_at.slice(0,10), map.description).appendTo($parent);
    });

  }

  function getMaps(){
    $.getJSON("/maps/json").then(function(maps){

      populateMapList(maps, $('#maps-list'));

    })
    .catch(function(err){
      console.log("Error getting maps", err);
    });
  }

  getMaps();

});
