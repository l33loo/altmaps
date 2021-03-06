"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const cookieSession = require('cookie-session');
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const bcrypt      = require('bcrypt');

// Seperated Routes for each Resource
const mapsRoutes = require("./routes/maps");
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["Slowly at first", "as if it hardly meant it", "the snow began to fall."],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000
}));

// checks session and if valid sets req.userLoggedIn = true (or false if not logged in)
app.use((req, res, next) => {
  // console.log(`req.session.userId is ${req.session.userId}`);
  if(req.session.userId){
    req.loggedIn = true;
  } else {
    req.loggedIn = false;
  }
  next();
});

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/maps", mapsRoutes(knex));
app.use("/users", usersRoutes(knex));

app.get("/", (req, res) => {
  res.redirect("/maps");
});

app.get("/login", (req, res) => {
  if(req.loggedIn){
    res.redirect("/");
  } else {
    res.render("login", {loggedIn: req.loggedIn, userId: req.session.userId});
  }
});

app.get("/register", (req, res) => {
  if(req.loggedIn){
    res.redirect("/");
  } else {
    res.render("register", {loggedIn: req.loggedIn, userId: req.session.userId});
  }
});

function checkEmptyFields(req, res) {
  return (!req.body.username ||
    !req.body.email ||
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.password);
}

// Calls callback if username does not already exist.
function checkUsernameReg(req, res, callback) {
  knex
    .select()
    .from('users')
    .where('username', req.body.username)
    .then(user => {
      if (!user.length) {
        callback();
      } else {
        res.status(200).send("1");
      }
    })
    .catch(err => {
      console.error(err);
    });
}

function checkEmailReg(req, res, cb) {
  knex
    .select()
    .from('users')
    .where('email', req.body.email)
    .then(user => {
      if (!user.length) {
        cb();
      } else {
        res.status(200).send("2");
      }
    })
    .catch(err => {
      console.error(err);
    });
}

function insertUserInfoDb(req, cb) {
  bcrypt.hash(req.body.password, 12)
  .then(hash => {
    knex("users").insert({
      username: req.body.username,
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password_hash: hash
    })
    .then(cb);
  })
  .catch(err => {
    console.error(err);
  });
}

function getUserIdFromEmail(req, res) {
  knex
    .select()
    .from('users')
    .where('email', req.body.email)
    .then(rows => {
      req.session.userId = rows[0].id;
      res.status(200).send();
    })
    .catch(err => {
      console.error(err);
    });
}

app.post("/register", (req, res) => {
  if (checkEmptyFields(req)) {
    res.status(200).send("3");
  } else {
    checkUsernameReg(req, res, function() {
      checkEmailReg(req, res, function() {
        insertUserInfoDb(req, function() {
          getUserIdFromEmail(req, res);
        });
      });
    });
  }
});

// logs in user with email
app.post("/login", (req, res) => {
  if(req.body.email) {
    knex
    .select()
    .from('users')
    .where('email', req.body.email)
    .then(rows => {
      req.session.userId = rows[0].id;
      res.redirect("/");
    })
    .catch(err => {
      console.error(err);
    });
  } else {
    res.redirect("/");
  }
});

// remove session cookie and redirect to main page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
