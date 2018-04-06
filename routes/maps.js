"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/:id/json", (req, res) => {
    knex
      .select("*")
      .from("map_pins")
      .where({map_id: req.params.id})
      .then((results) => {
        res.json(results);
    });
  });

  // MAPS
  router.get("", (req, res) => {
    res.render("index");
  });

  // MAP
  router.get("/:mapID", (req, res) => {
    // if (/* map exists and user authorized */) {
      res.render("map");

    // Do we instead want to redirect to  with a flash error message on the page or alert?
    // } else if (/* map doesn't exist */) {
      // res.status(404).send("<html><body>This map does not exist. Please try again.</body></html>\n");
    // } else /* if user not authorized */ {
    //   res.status(403).send(`<html><body>Forbidden.</body></html>\n`);
    // }
  });

  // CREATE MAP (not sure how it works with Google Maps API)
  router.get("/new", (req, res) => {
    // res.render... ?
  });
  router.post("/new" /*or just '' ? */, (req, res) => {
    // ...?
    res.redirect("/:mapID");
  });

  // EDIT MAP via AJAX (PUT "/:mapID") (router.js);
  // when session === maps.userID, in map.ejs

  // CREATE PIN (not sure how it works with Google Maps API). AJAX?

  return router;
}
