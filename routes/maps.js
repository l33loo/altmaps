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

  router.get("/json", (req, res) => {
    if(req.loggedIn){
      // SELECT * FROM favorite_maps RIGHT JOIN maps ON favorite_maps.map_id = maps.id AND favorite_maps.user_id = 1 ORDER BY maps.id
      //SELECT * FROM maps LEFT JOIN favorite_maps ON maps.id = favorite_maps.map_id AND favorite_maps.user_id = ?
      knex.raw("SELECT * FROM favorite_maps RIGHT JOIN maps ON favorite_maps.map_id = maps.id AND favorite_maps.user_id = ? ORDER BY maps.id", [req.session.userId])
        .then((results) => {
          res.json(results.rows);
      });
    } else {
      knex
        .select("*")
        .from("maps")
        .then((results) => {
          res.json(results);
      });
    }

  });

  // MAPS
  router.get("", (req, res) => {
    console.log("req.loggedIn: ", req.loggedIn);
    res.render("index", {loggedIn: req.loggedIn, userId: req.session.userId});
  });

  // CREATE MAP (not sure how it works with Google Maps API)
  router.get("/new", (req, res) => {
    res.render("create_map", {loggedIn: req.loggedIn, userId: req.session.userId});
  });

  // MAP
  router.get("/:mapID", (req, res) => {
    // if (/* map exists and user authorized */) {
      res.render("map", {loggedIn: req.loggedIn, userId: req.session.userId});

    // Do we instead want to redirect to  with a flash error message on the page or alert?
    // } else if (/* map doesn't exist */) {
      // res.status(404).send("<html><body>This map does not exist. Please try again.</body></html>\n");
    // } else /* if user not authorized */ {
    //   res.status(403).send(`<html><body>Forbidden.</body></html>\n`);
    // }
  });


  router.post("/new" /*or just '' ? */, (req, res) => {
    if(req.loggedIn){
      knex("maps").insert({

        created_by: req.session.userId,
        title: req.body.title,
        description: req.body.description
      }).returning("id")
      .then(function(response){
        console.log(response)
        res.redirect("../")
      })
      .catch(function(err) {
        console.error(err);
        res.redirect("/");
      });
    }
  });

  router.post("/favorite", (req, res) => {
    if(req.loggedIn){
      knex("favorite_maps").insert({
        user_id: req.session.userId,
        map_id: req.body.map_id,
      })
      .then(function(){
        res.status(200).send();
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send("Error inserting favourite");
      });
    }
  });

  router.delete("/favorite", (req, res) => {
    if (req.loggedIn) {
      knex("favorite_maps")
        .where({user_id: req.session.userId, map_id: req.body.map_id})
        .del()
        .then(function(){
          res.status(200).send();
        })
        .catch(function(err) {
          console.error(err);
          res.status(500).send("Error deleting favourite");
        });
    }
  });

  // EDIT MAP via AJAX (PUT "/:mapID") (router.js);
  // when session === maps.userID, in map.ejs


  router.post("/:mapID" /*or just '' ? */, (req, res) => {
    //if (user logged in)...
    knex("map_pins").insert({

      //created_by: req.session.user_id?
      created_by: Number(req.body.created_by),
      map_id: Number(req.body.map_id),
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      title: req.body.title,
      description: req.body.description
    })
    .then(res.status(201).send())
    .catch(function(err) {
      console.error(err);
    });
  });

  return router;
}
