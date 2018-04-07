$(document).ready(function() {

  function createMapsList(title /*cl*/) {
    // var $list = $('<div>').addClass(cl);
    var $mapTitle = $('<p>').text(title);
    console.log($mapTitle);
    // return $list;
    return $mapTitle;
  }

  function populateFavList(maps, $parent) {

    maps.forEach(function(map) {
      createMapsList(map.title /*, "fav-list"*/).appendTo($parent);
    });
  }

  function populateContribList(maps) {
    maps.forEach(function(map) {
      createMapsList(map.title).appendTo($parent);
    });
  }

  function getFavs() {
    // "/maps/" + currentMap.mapId + "/json"
      $.getJSON("/users/" + req.session.userId + "/fav/json").then(function(maps) {
        // console.log("maps: " + maps);
        // console.log("type of maps: " + typeof maps);
        populateFavList(maps, $('#fav'));
      })
      .catch(function(err) {
        console.log("Error getting favorite maps", err);
      });
    }

  function getContrib() {
      $.getJSON("/users/" + req.session.userId + "/contrib/json").then(function(maps) {
        populateContribList(maps, $('#contrib'));
      })
      .catch(function(err) {
        console.log("Error getting maps", err);
      });
    }


  getFavs();

}
  // doesn;t work yet.
  // getContrib();

});

// <div class="ui container segment">
//         <div class="ui segment">
//           <h1>-Lila2's profile-</h1>
//         </div>
//       <div class="ui segment">
//         <div class="ui three column very relaxed grid">
//           <div class="column">
//             <img src="/images/map_placeholder.jpg">
//             <p>This is me. I don't have much to say, but now that I think of it, let me tell you about the last burger I ate. That was a year ago. I still dream about it. But now that cows have gone extinct, there isn't much one can do aside from dreaming...</p>
//           </div>
//           <div class="ui vertical divider">
//           </div>
//           <div class="column">
//             <div class="fav">
//               <h2>Favorite Maps</h2>
//             </div>
//           </div>
//           <div class="column">
//             <div class="contrib">
//               <h2>Contributor on</h2>
//             </div>
//           </div>
//         </div>
//       </div>
//       </div>
