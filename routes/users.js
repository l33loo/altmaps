"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // json of user's favorite maps
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

  // json of maps user has contributed to.
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

  router.get("/json", (req, res) => {
    knex
      .select()
      .from("users")
      .then((results) => {
        res.json(results);
      });
  });

  function getPage(req, res, uID) {
    if (req.loggedIn) {
      knex("users")
        .select()
        .where("id", uID)
        .limit(1)
        .then(rows => {
          res.render("user", {loggedIn: req.loggedIn, username: rows[0].username, userId: uID});
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      res.render("user", {loggedIn: req.loggedIn, username: null, userId: null});
    }
  }

  router.get("/profile", (req, res) => {
    res.redirect(`/users/${req.session.userId}`);
  });

  router.get("/:userId", (req, res) => {
    getPage(req, res, req.params.userId);
  });

  router.post("/:userId/about", (req, res) => {
    if(req.loggedIn){
      knex("users").insert({
        about: req.body.about
      }).returning("about")
      .then(function(response){
        res.status(201).send(response[0]);
      })
      .catch(function(err) {
        console.error(err);
        res.redirect("/");
      });
    }
  });

  return router;
};
