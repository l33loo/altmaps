$(document).ready(function(){

  function createMapCard(id, title, created_by, updated_at, description, favorite){

    var $card = $('<div class="card">').data({mapId: id});
    $('<div class="image"><img src="/images/map_placeholder.jpg"></div>').appendTo($card);
    var $content = $('<div class="content">').appendTo($card);
    var $title = $('<div class="header">').text(title).appendTo($content);

    if(favorite !== undefined){
      var $favourite = $('<span class="right floated"></span>').appendTo($title);
      var $heart = $('<i class="heart outline icon"></i>').data({mapId: id}).appendTo($favourite);
    }
    var $description = $('<div class="description">').text(description).appendTo($content);

    var $extraContent = $('<div class="extra content">').appendTo($card);
    var $rightFooter = $('<span class="right floated">').text(updated_at).appendTo($extraContent);
    var $leftFooter = $('<span>').text("75 Contributors").appendTo($extraContent);
    var $icon = $('<i class="user icon"></i>').insertBefore($leftFooter);

    if(favorite){
      toggleFavourite($heart);
    }


    return $card;

  }

  function populateMapList(maps, $parent){
    maps.forEach(function(map){
      var favorite = undefined;
      if("user_id" in map){
        //if user_id key exists then this is for a logged in user (if user is logged in, server returns an outer join of favorites and maps, otherwise just returns maps.)
        favorite = map.user_id;
        //this will either be null, if map isn't in user's favorites, or equal to user's id.
      }
      createMapCard(map.id, map.title, map.created_by, map.updated_at.slice(0,10), map.description, map.user_id).appendTo($parent);
    });

  }

// toggles the "like" heart immediately in the DOM, and also updates database in background
function toggleFavourite($favorite){
  if($favorite.data("is-favorite")){
    $favorite.toggleClass("outline red");
    $favorite.data({isFavorite: false});
  } else {
    $favorite.toggleClass("outline red");
    $favorite.data({isFavorite: true});
  }


}

  function getMaps(){
    $.getJSON("/maps/json").then(function(maps){

      populateMapList(maps, $('#maps-list'));

      $("div.card i.heart").on("click", function(event){
        event.stopPropagation();

        // do database stuff via ajax.
        if($(this).data("is-favorite")){
          //if user clicked on favorite, delete favorite.
          $.ajax({
              method: "DELETE",
              url: "/maps/" + $(this).data("map-id") + "/favorite"
            });
        } else {
          // if user clicked on non-favorite, add as favorite.
          $.ajax({
              method: "POST",
              url: "/maps/" + $(this).data("map-id") + "/favorite"
            });
        }

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
