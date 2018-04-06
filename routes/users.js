"use strict";

const express = require('express');

const router  = express.Router();

module.exports = (knex) => {

  // VIEW USER PROFILE
  router.get("/:userID", (req, res) => {
    // if (/* userID exists*/) {
      res.render("user");
    // } else {
    //   res.status(404).send("<html><body>This user does not exist. Please try again.</body></html>\n");
    // }
  });

  // EDIT USER PROFILE via AJAX (app.js) (PUT "/users/:userID");
  // when session === maps.userID, in user.ejs



  // LOGIN via AJAX (app.js); login form in nav bar;

  return router;
}
