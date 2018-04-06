"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const mapsRoutes = require("./routes/maps");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/maps", mapsRoutes(knex));

// HOME
app.get("/", (req, res) => {
  res.redirect("/maps");
});

// USER PROFILE
app.get("/users/:userID", (req, res) => {
  // if (/* userID exists*/) {
    res.render("user");
  // } else {
  //   res.status(404).send("<html><body>This user does not exist. Please try again.</body></html>\n");
  // }
});

// EDIT USER PROFILE via AJAX (app.js) (PUT "/users/:userID");
// when session === maps.userID, in user.ejs

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  // Display error messages directly on page with jQUERY (app.js):
  // 1. email/username already registered
  // 2. Invalid email/username
  // 3. Invalid password
});

// LOGIN via AJAX (app.js); login form in nav bar;

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
