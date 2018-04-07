"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/:id/fav/json", (req, res) => {
    knex
      .select("title", "description", "map_id")
      .from("favorite_maps")
      .leftOuterJoin("maps", "favorite_maps.map_id", "maps.id")
      .where({user_id: req.params.id})
      .then((results) => {
        res.json(results);
      });
  });

  // Doesn't work because created_by exists in bpth maps and map_pins table (so does title)
  router.get("/:id/contrib/json", (req, res) => {
    knex
      .select("maps.title", "maps.description", "map_id")
      .from("map_pins")
      .leftOuterJoin("maps", "map_pins.map_id", "maps.id")
      .where("map_pins.created_by", req.params.id)
      .groupBy("maps.title", "maps.description", "map_pins.map_id")
      .then((results) => {
        res.json(results);
      });
  });

  // VIEW USER PROFILE
  router.get("/:userID", (req, res) => {
    // if (exists) {
      // if (loggedIn) { //
        res.render("user", {loggedIn: req.loggedIn, userId: req.session.userId, profileId: req.params.userID});
      // } else {
        // res.status(40).send -- unauthorized, need to log in
      // }
    // } else {}
    //   res.status(404).send("<html><body>This user does not exist. Please try again.</body></html>\n");
    // }
  });

  // EDIT USER PROFILE via AJAX (app.js) (PUT "/users/:userID");
  // when session === maps.userID, in user.ejs



  // LOGIN via AJAX (app.js); login form in nav bar;

  return router;
}
