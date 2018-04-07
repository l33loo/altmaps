"use strict";

const express = require('express');

const router  = express.Router();

module.exports = (knex) => {

  router.get("/:id/json", (req, res) => {
    knex
      .select("*")
      .from("maps")
      .fullOuterJoin("favorite_maps", "maps.created_by", "favorite_maps.user_id")
      .where({user_id: req.params.id})
      .then((results) => {
        res.json(results);
      });
  });

  // VIEW USER PROFILE
  router.get("/:userID", (req, res) => {
    // if (exists) {
      // if (loggedIn) { //
        res.render("user", {loggedIn: req.loggedIn, userId: req.session.userId});
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
