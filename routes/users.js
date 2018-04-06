"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/maps/:id", (req, res) => {
    knex
      .select("*")
      .from("map_pins")
      .where({map_id: req.params.id})
      .then((results) => {
        res.json(results);
    });
  });

  return router;
}
