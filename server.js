"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const cookieSession = require('cookie-session')
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
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
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

//This is Don's custom middleware
//After session is configured, but BEFORE routes:
//Check to see if there is a user_id in req.session
//If there is, set req.loggedIn and look up the user from the db
//Save user in a key on the request object, making it available
//to routes later on
// app.use((req, res, next) => {
//   req.loggedIn = Boolean(req.session.user_id);
//   if (req.loggedIn) {
//     process.knex('users').select().where('id', req.session.user_id)
//     .then(user => {
//       req.user = user[0];
//       next();
//     })
//     .catch(err => {
//       pino.error("USER WTF: ", err);
//       next();
//     });
//   }
// });

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

// HOME
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

//works
function checkEmptyFields(info) {
  console.log(typeof info.username);
  if (info.username === "" ||
      info.email === "" ||
      info.firstName === "" ||
      info.lastName === "" ||
      info.password === "") {
    return true;
  } else {
    return false;
  }
}

  function checkUsernameReg(uName) {
    console.log("checkUsernameReg");
    knex
      .select()
      .from('users')
      .where('username', uName)
      .then(user => {
        console.log("boolean user[0] : " + Boolean(user[0]));
        console.log(user[0]);
        return Boolean(user[0]);
      })
      .catch(err => {
        console.error(err);
    });
      return false;
  }

  function checkEmailReg(email) {
    console.log("checkEmailReg");
    knex
      .select()
      .from('users')
      .where('email', email)
      .then(user => {
        return Boolean(user[0]);
      })
      .catch(err => {
        console.error(err);
    });
    return false;
  }








app.post("/register", (req, res) => {
  if (checkEmptyFields(req.body)) {
    console.log(checkEmptyFields(req.body) === true);
      res.status(400).send("Please fill out all the fields.");
    } else if (checkUsernameReg(req.body.username) === true) {
      res.status(400).send("This username is already registered.");
    } else if (checkEmailReg(req.body.email) === true) {
      res.status(400).send("This email is already registered. Please log in instead.");
    } else {
      bcrypt.hash(req.body.password, 12)
      .then(function(hash) {
        knex("users").insert({
          username: req.body.username,
          email: req.body.email,
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          password_hash: hash
        })
      .then(res.status(201).send())
      .catch(err => {
          console.error(err);
        });
      });
      const userIdFromEmail = knex
        .select()
        .from('users')
        .where('email', req.body.email)
        .then(user => {
          console.log("user 0: " + user[0]);
          return user[0].id.toString();
      });
  console.log("get user from email: " + userIdFromEmail);
      // req.session.userId = userIdFromEmail;
      res.redirect("/maps");
    }
  // Display error messages directly on page with jQUERY (app.js):
  // 1. email/username already registered
  // 2. Invalid email/username
  // 3. Invalid password
});

// logs in user by user_id, which is entered into the email field on client side.
app.post("/login", (req, res) => {
  if(req.body.email) {
    knex
      .select()
      .from('users')
      .where('email', req.body.email)
      .asCallback(function(err, rows) {
        if (err) {
          return console.error(err);
        }
        req.session.userId = rows[0].id;
        res.redirect("/");
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
