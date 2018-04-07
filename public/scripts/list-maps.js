$(document).ready(function(){

  function createMapCard(id, title, created_by, updated_at, description){

    var $card = $('<div class="card">').data({mapId: id});
    $('<div class="image"><img src="/images/map_placeholder.jpg"></div>').appendTo($card);
    var $content = $('<div class="content">').appendTo($card);
    var $title = $('<div class="header">').text(title).appendTo($content);
    var $favourite = $('<span class="right floated"><i class="heart outline icon"></i></span>').appendTo($title);
    var $description = $('<div class="description">').text(description).appendTo($content);

    var $extraContent = $('<div class="extra content">').appendTo($card);
    var $rightFooter = $('<span class="right floated">').text(updated_at).appendTo($extraContent);
    var $leftFooter = $('<span>').text("75 Contributors").appendTo($extraContent);
    var $icon = $('<i class="user icon"></i>').insertBefore($leftFooter);

    return $card;

  }

  function populateMapList(maps, $parent){
    console.dir(maps);
    maps.forEach(function(map){
      createMapCard(map.id, map.title, map.created_by, map.updated_at.slice(0,10), map.description).appendTo($parent);
    });

  }

// toggles the "like" heart immediately in the DOM, and also updates database in background
function toggleFavourite($favourite){
  $favourite.toggleClass("outline red");
  // $favourite.append('<div class="ui red tag label">Favourited!</div>');

  // this needs to set up a post request eventually to store the favourite in the database.
  // let id = $like.data("mongo-id");
  // $.post(`/tweets/${id}/like`, "");
}

  function getMaps(){
    $.getJSON("/maps/json").then(function(maps){

      populateMapList(maps, $('#maps-list'));

      $("div.card i.heart").on("click", function(event){
        event.stopPropagation();
        toggleFavourite($(this));
      });

      $('div.card').on("click", function(){
        window.location.href = "/maps/" + $(this).data().mapId;
      })

    })
    .catch(function(err){
      console.log("Error getting maps", err);
    });
  }

  getMaps();

});
