"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/:id/json", (req, res) => {
    knex
      .select(
        "map_pins.id",
        "map_id",
        "place_id",
        "latitude",
        "longitude",
        "title",
        "description",
        "category",
        "color",
        "map_pins.created_at",
        "map_pins.updated_at",
        "username",
        "created_by")
      .from("map_pins")
      .leftOuterJoin('users', 'created_by', 'users.id')
      .where({map_id: req.params.id})
      .orderBy("title", "DESC")
      .then((results) => {
        if(req.loggedIn){
          for(let row in results){
            results[row].loggedIn = true;
          }
        }
        res.json(results);
    });
  });

  router.get("/json", (req, res) => {
    if(req.loggedIn){

      // selects maps and favourite status for current user
      knex.raw("SELECT * FROM favorite_maps RIGHT JOIN maps ON favorite_maps.map_id = maps.id AND favorite_maps.user_id = ? ORDER BY maps.id", [req.session.userId])
        .then((results) => {
          // to avoid the mother of all SQL queries, selects contributor count for each map.
          knex.raw("SELECT map_id, COUNT(DISTINCT created_by) AS contributors FROM map_pins GROUP BY map_id ORDER BY map_id")
          .then((contributorsResults) => {

            // add the contributor counts to each result row (aka map)
            // note we need to reference .rows because we used knex.raw for the query
            results.rows.forEach((row, index) => {
              row.contributors = contributorsResults.rows[index].contributors;
            });

            // send response as json.
            res.json(results.rows);
          });
      });
    } else {

      // if not logged in, just select all maps (no favourite data if no user)
      knex
        .select("*")
        .from("maps")
        .then((results) => {
          // select contributor count
          knex.raw("SELECT map_id, COUNT(DISTINCT created_by) AS contributors FROM map_pins GROUP BY map_id ORDER BY map_id")
          .then((contributorsResults) => {

            // add the contributor counts to each result row (aka map)
            // note that here results is the array of rows because we used knex queries.
            results.forEach((row, index) => {
              row.contributors = contributorsResults.rows[index].contributors;
            });

            // send response as json.
            res.json(results);
          });
      });
    }

  });

function getPage(req, res, views) {
  if (req.loggedIn) {
    knex("users")
      .select()
      .where("id", req.session.userId)
      .limit(1)
      .then(rows => {
        res.render(views, {loggedIn: req.loggedIn, userId: req.params.userId, username: rows[0].username});
      })
      .catch(err => {
        console.error(err);
      });
  } else {
    res.render(views, {loggedIn: req.loggedIn, userId: req.params.userId});
  }
}
  // MAPS
  router.get("", (req, res) => {
    getPage(req, res, "index");
  });

  // CREATE MAP (not sure how it works with Google Maps API)
  router.get("/new", (req, res) => {
    getPage(req, res, "create_map")
  });


// knex.select('*')
// .from('users')
// .fullOuterJoin('accounts', 'users.id', 'accounts.user_id')

  // MAP
  router.get("/:mapID", (req, res) => {
    let templateVars = new Object;
    knex("maps")
    .select("title", "description")
    .where("id", req.params.mapID)
    .limit(1)
    .then(function(result) {

      templateVars["loggedIn"] = req.loggedIn;
      templateVars["userId"] = req.session.userId;
      templateVars["title"] = result[0].title;
      templateVars["description"] = result[0].description;
    })
    .then(() => {
      if(req.loggedIn){
        knex("users")
        .select()
        .where("id", req.session.userId)
        .limit(1)
        .then(function(rows) {

          templateVars["username"] = rows[0].username;
        })
        .then(() => {
          res.render("map", templateVars);
        })
      } else {
        templateVars["username"] = undefined;
        res.render("map", templateVars);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(404).send("This maps does not exist.");
    });


    // Do we instead want to redirect to  with a flash error message on the page or alert?
    // } else if (/* map doesn't exist */) {
      // res.status(404).send("<html><body>This map does not exist. Please try again.</body></html>\n");
    // } else /* if user not authorized */ {
    //   res.status(403).send(`<html><body>Forbidden.</body></html>\n`);
    // }
  });


  router.post("/new", (req, res) => {
    if(req.loggedIn){
      knex("maps").insert({

        created_by: req.session.userId,
        title: req.body.title,
        description: req.body.description
      }).returning("id")
      .then(function(response){
        console.log(response)
        res.redirect("/maps/" + response[0])
      })
      .catch(function(err) {
        console.error(err);
        res.redirect("/");
      });
    }
  });

  router.post("/:mapId/favorite", (req, res) => {
    if(req.loggedIn){
      knex("favorite_maps").insert({
        user_id: req.session.userId,
        map_id: req.params.mapId,
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

  router.delete("/:mapId/favorite", (req, res) => {
    if (req.loggedIn) {
      knex("favorite_maps")
        .where({user_id: req.session.userId, map_id: req.params.mapId})
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

  router.delete("/:mapID/:pinID" , (req, res) => {
    //if (user logged in)...
    if(req.loggedIn){
      knex("map_pins")
        .del()
        .where("id",  req.params.pinID)
        .then(res.status(201).send())
        .catch(function(err) {
          console.error(err);
          res.status(500).send();
        });
    } else {
      res.status(401).send();
    }
  });

  // EDIT MAP via AJAX (PUT "/:mapID") (router.js);
  // when session === maps.userID, in map.ejs


  router.post("/:mapID" /*or just '' ? */, (req, res) => {
    //if (user logged in)...
    if(req.loggedIn){
      knex("map_pins").insert({

        created_by: req.session.userId,
        map_id: req.params.mapID,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        title: req.body.title,
        description: req.body.description
      })
      .then(res.status(201).send())
      .catch(function(err) {
        console.error(err);
        res.status(500).send();
      });
    } else {
      res.status(401).send();
    }
  });

  router.put("/:mapID/:pinID" /*or just '' ? */, (req, res) => {
    //if (user logged in)...
    if(req.loggedIn){
      knex("map_pins")
        .update({
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          title: req.body.title,
          description: req.body.description
        })
        .where("id",  req.params.pinID)
        .then(res.status(201).send())
        .catch(function(err) {
          console.error(err);
          res.status(500).send();
        });
    } else {
      res.status(401).send();
    }
  });

  return router;
}
